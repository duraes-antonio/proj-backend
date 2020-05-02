import axios from 'axios';
import paypal from 'paypal-rest-sdk';
import queryString from 'query-string';
import { Order, OrderAdd, OrderInput } from '../domain/models/order';
import { Product } from '../domain/models/product';
import { ItemOrder } from '../domain/models/item-order';
import { productRepository } from '../data/repository/product.repository';
import { config } from './config/config';
import { orderService } from './order.service';
import { PaymentMethod } from '../domain/enum/payment';
import { DeliveryOptionType } from '../domain/models/shipping/delivery';
import { UnknownError } from '../domain/helpers/error';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mercadoPago = require('mercadopago');

export type Customer = {
    name: string;
    email: string;
    cpf: string;
    codeArea: number;
    phone: string;
}

mercadoPago.configure({
    'access_token': config.mercadoPago.accessToken
});

// TODO: Desenvolver implementação
const payWithMercadoPago = async (): Promise<{ data: string }> => {
    const preference = {
        items: [
            {
                'title': 'Meu produto',
                'unit_price': 100,
                'quantity': 1
            }
        ]
    };

    const response = await mercadoPago.preferences.create(preference);
    return { data: response.body.id };
};

// TODO: Desenvolver implementação
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const payWithPaypal = async (order: OrderAdd): Promise<string> => {
    /*TODO:
       - Adicionar items a uma cesta;
       - Calcular preço de cada item;
       - Calcular preço de entrega de cada item;
       - Total (custo de entrega + custo de itens)
       */
    // TODO: Obter produtos
    const prods: Product[] = await productRepository.find(
      {
          currentPage: 1,
          perPage: 1000
      });

    const cart = prods.map(p => {
        return {
            'currency': 'BRL',
            'name': p.title,
            'price': (p.price * (100 - p.percentOff) / 100).toFixed(2),
            'sku': p.id,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            'quantity': order.items
              .find(i => i.productId === p.id.toString())
              .quantity
        };
    });
    const itemsTotalPrice = cart
      .map(p => +p.quantity * +p.price)
      .reduce((p, c) => p + c);
    /*TODO: Calcular frete por item*/
    const deliveryCost = 25.75;
    const payment = {
        'intent': 'sale',
        'payer': { 'payment_method': 'paypal' },
        'redirect_urls': {
            'return_url': 'http://localhost:4200/home',
            'cancel_url': 'http://localhost:4200/home'
        },
        'transactions': [{
            'item_list': {
                'items': cart
            },
            'amount': {
                'currency': 'BRL',
                /*TODO: Caluclar o total*/
                'total': (deliveryCost + itemsTotalPrice).toFixed(2),
                'details': {
                    'subtotal': itemsTotalPrice.toFixed(2),
                    'shipping': deliveryCost.toFixed(2)
                }
            },
            'description': `${prods.length} itens`
        }]
    };
    const ppConfig = paypal.configure({
        'client_id': config.paypal.clientId,
        'client_secret': config.paypal.secret,
        'mode': config.paypal.mode
    });
    const res = await paypal.payment.create(
      payment,
      (err, p) => {
          if (err) {
              console.log(err);
              return err;
          } else {
              console.log(p);
              return p;
          }
      });
    const x = 10;
};

/*O ambiente sandbox só aceita emails com pós-fixo '@sandbox.pagseguro.com.br'*/
const payWithPagSeguro = async (customer: Customer, orderInput: OrderInput): Promise<string> => {
    const orderId = (await orderService.create(orderInput, PaymentMethod.PAG_SEGURO)).id;
    const order = await orderService.findById(orderId) as Order;
    const url = `${config.pagSeguro.urlCheckout}?email=${config.pagSeguro.email}&token=${config.pagSeguro.token}`;
    const queryPostItems: any = {};

    order.items.forEach((item: ItemOrder, index: number) => {
        queryPostItems[`itemId${index + 1}`] = item.productId;
        queryPostItems[`itemDescription${index + 1}`] = item.product.title;
        queryPostItems[`itemAmount${index + 1}`] = (item.product.price * (1 - item.product.percentOff / 100)).toFixed(2);
        queryPostItems[`itemQuantity${index + 1}`] = item.quantity;
    });
    const queryPost = {
        // Dados de pagamento
        currency: 'BRL',
        receiverEmail: config.pagSeguro.email,
        extraAmount: '0.00',

        // Dados sobre items do pedido
        ...queryPostItems,

        // Dados do comprador
        senderName: customer.name,
        senderCPF: customer.cpf,
        senderAreaCode: customer.codeArea,
        senderPhone: customer.phone,
        senderEmail: customer.email,

        // Dados de entrega
        shippingAddressRequired: true,
        shippingAddressStreet: order.addressTarget.street,
        shippingAddressNumber: order.addressTarget.number,
        shippingAddressComplement: '',
        shippingAddressDistrict: order.addressTarget.neighborhood,
        shippingAddressPostalCode: order.addressTarget.zipCode,
        shippingAddressCity: order.addressTarget.city,
        shippingAddressState: order.addressTarget.state,
        shippingAddressCountry: 'BRA',
        shippingType: order.optionDeliveryType === DeliveryOptionType.PAC ? 1 : 2,
        shippingCost: order.costDelivery.toFixed(2)
    };
    const configRequest = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    let res;

    try {
        res = await axios.post(url, queryString.stringify(queryPost), configRequest);
    } catch (e) {
        throw new UnknownError({ msg: e.message, name: e.name });
    }

    const arrMatchesIds = /<code>([\da-zA-Z]+)<\/code>/.exec(res.data);

    if (!arrMatchesIds) {
        throw new Error('Código da transação não foi retornado pelo PagSeguro. Contate o Administrador do sistema.');
    }

    const transactionId = arrMatchesIds[arrMatchesIds.length - 1];
    orderService.update(order.id, { transactionId });
    return transactionId;
};

const updateStatusPagSeguro = async (notifCode: string): Promise<void> => {
    const urlNotifGet = `config.pagSeguro.urlGetNotific/${notifCode}`;
    try {
        const notificationXML = await axios.get(
          `${urlNotifGet}?email=${config.pagSeguro.email}&token=${config.pagSeguro.token}`
        );
    } catch (e) {
        throw new UnknownError(e);
    }
};

export const paymentService = {
    payWithMercadoPago,
    payWithPagSeguro,
    payWithPaypal,
    updateStatusPagSeguro
};
