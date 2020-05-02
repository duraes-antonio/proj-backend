'use strict';
import { Product } from '../../domain/models/product';
import { Deliverable, DeliveryEstimativeInput, DeliveryOption } from '../../domain/models/shipping/delivery';
import { correiosService } from './correios.service';

const calcCostDaysOrder = async (
  input: DeliveryEstimativeInput, fnGetProducts: (ids: string[]) => Promise<Product[]>
): Promise<DeliveryOption[]> => {
    const products: Product[] = await fnGetProducts(input.itemsOrder.map(i => i.productId));
    const idProductMap: Map<string, Product> = new Map(products.map(p => [p.id.toString(), p]));
    const deliverables = input.itemsOrder
      .map(item => {
          const product = idProductMap.get(item.productId) as Product;
          return {
              amount: item.quantity,
              height: product.height,
              length: product.length,
              weight: product.weight,
              width: product.width
          } as Deliverable;
      });
    return await correiosService.calculateCostDaysOrder(
      input.zipcodeOrigin, input.zipcodeTarget, deliverables
    );
};

const calcCostDaysOrderWithProducts = async (
  input: DeliveryEstimativeInput, products: Product[]
): Promise<DeliveryOption[]> => {
    const idProductMap: Map<string, Product> = new Map(products.map(p => [p.id.toString(), p]));
    const deliverables = input.itemsOrder
      .map(item => {
          const product = idProductMap.get(item.productId) as Product;
          return {
              amount: item.quantity,
              height: product.height,
              length: product.length,
              weight: product.weight,
              width: product.width
          } as Deliverable;
      });
    return await correiosService.calculateCostDaysOrder(
      input.zipcodeOrigin, input.zipcodeTarget, deliverables
    );
};

export const shippingService = {
    calcCostDaysOrder,
    calcCostDaysOrderWithProducts
};
