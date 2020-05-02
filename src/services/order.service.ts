import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { Order, OrderAdd, OrderInput, OrderPatch } from '../domain/models/order';
import { itemOrderSizes, orderSizes } from '../shared/fieldSize';
import { ItemOrder, ItemOrderAdd } from '../domain/models/item-order';
import { ItemStock } from '../controllers/base/response.functions';
import { FilterProduct } from '../domain/models/filters/filter-product';
import { productRepository } from '../data/repository/product.repository';
import { Product } from '../domain/models/product';
import { repositoryFunctions as repoFns } from '../data/repository.functions';
import { AddressSchema } from '../data/schemas/address.schema';
import { DeliveryOption } from '../domain/models/shipping/delivery';
import { shippingService } from './shipping/shipping.service';
import { ItemOrderSchema } from '../data/schemas/item-order.schema';
import { OrderSchema } from '../data/schemas/order.schema';
import {
    BadRequestError,
    NotEnoughStockError,
    NotFoundError,
    NotFoundManyError,
    UnknownError
} from '../domain/helpers/error';
import { PaymentMethod, PaymentStatus } from '../domain/enum/payment';

const validate = (order: OrderInput, ignoreUndefined = false): PipelineValidation => {
    const itemsQuantity = order.items.map(item => item.quantity);
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .hasValue('addressTargetId', order.addressTargetId)
      .hasValue('optionDeliveryType', order.addressTargetId)
      .atLeastLenList('items', order.items, orderSizes.itemsMin, msg.minLenList)
      .atMaxLenList('items', order.items, orderSizes.itemsMax, msg.maxLenList)
      .hasValue('productId', order.items.map(item => item.productId))
      .atLeastValue('quantity', itemsQuantity, itemOrderSizes.quantityMin, msg.minValue)
      .atMaxValue('quantity', itemsQuantity, itemOrderSizes.quantityMax, msg.maxValue)
      ;
};

const create = async (
  orderInput: OrderInput, paymentMethod: PaymentMethod, paymentStatus?: PaymentStatus
): Promise<Order> => {
    let itemsSaveds: ItemOrder[] = [];

    const validationOrder = validate(orderInput);

    if (!validationOrder.valid) {
        throw new BadRequestError(validationOrder.errors);
    }

    const filterProduct: FilterProduct = {
        perPage: orderInput.items.length,
        currentPage: 1,
        ids: orderInput.items.map(item => item.productId)
    };

    // busque os produtos p/ ter acesso ao seu preço e quantidade disponíveis
    const products = await productRepository.find(filterProduct);
    const mapProductItem: Map<ItemOrderAdd, Product> = new Map(
      orderInput.items.map(item =>
        [item, products.find(p => p.id.toString() === item.productId) as Product]
      )
    );

    // verifique se há ids nos items que não correspondam a produtos
    const idsProductsNotFound = Array.from(mapProductItem)
      .filter((pair: [ItemOrderAdd, Product]) => !pair[1])
      .map((pair: [ItemOrderAdd, Product]) => pair[0].productId);

    if (idsProductsNotFound.length) {
        throw new NotFoundManyError('Produto', 'id', idsProductsNotFound);
    }

    // verifique se há algum produto com quantidade superior ao estoque
    const productsNotEnough: ItemStock[] = Array.from(mapProductItem)
      .filter((pair: [ItemOrderAdd, Product]) => pair[0].quantity > (pair[1] as Product).quantity)
      .map(pair => {
          return { productName: pair[1].title, quantityAvailable: pair[1].quantity };
      });

    if (productsNotEnough.length) {
        throw new NotEnoughStockError(productsNotEnough);
    }

    // criar os objetos de items de pedido
    const itemsOrder: ItemOrderAdd[] = Array.from(mapProductItem)
      .map((pair: [ItemOrderAdd, Product]) => {
          return { ...pair[0], unitPrice: pair[1].priceWithDiscount };
      });

    const addressTarget = await repoFns.findById(orderInput.addressTargetId, AddressSchema);

    if (!addressTarget) {
        throw new NotFoundError('Endereço', 'id', orderInput.addressTargetId);
    }

    // TODO: Obter CEP da loja
    const optionsDelivery: DeliveryOption[] = await shippingService.calcCostDaysOrderWithProducts(
      { zipcodeOrigin: '29161699', zipcodeTarget: addressTarget.zipCode, itemsOrder },
      products
    );
    const chosenDeliveryOpt = optionsDelivery
      .find(opt => opt.typeService === orderInput.optionDeliveryType) as DeliveryOption;

    itemsSaveds = await repoFns.createMany(itemsOrder, ItemOrderSchema) as ItemOrder[];

    try {
        const orderAdd: OrderAdd = {
            ...orderInput,
            costDelivery: chosenDeliveryOpt.cost,
            daysForDelivery: chosenDeliveryOpt.timeDays,
            itemsId: itemsSaveds.map(item => item.id),
            userId: addressTarget.userId,
            paymentMethod,
            paymentStatus
        };
        return await repoFns.create(orderAdd, OrderSchema) as Order;
    } catch (err) {
        await repoFns.deleteMany(itemsSaveds.map(i => i.id), ItemOrderSchema);
        throw new UnknownError();
    }
};

// TODO: Chamar serviço genérico
const findById = async (id: string): Promise<Order | null> => {
    return repoFns.findById(
      id, OrderSchema,
      {
          path: 'items addressTarget',
          populate: {
              path: 'product'
          }
      });
};

const update = async (id: string, patchObject: OrderPatch): Promise<Order | null> => {
    return repoFns.findAndUpdate<Order>(id, patchObject, OrderSchema);
};

export const orderService = {
    create,
    findById,
    validate,
    update
};
