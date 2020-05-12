'use strict';
import { Order, OrderInput } from '../domain/models/order';
import { ItemOrder } from '../domain/models/item-order';
import { config } from './config/config';
import { orderService } from './order.service';
import { PagSeguroStatusPayment, PaymentMethod, PaymentStatus, PayPalStatusPayment } from '../domain/enum/payment';
import { DeliveryOptionType } from '../domain/models/shipping/delivery';
import { AxiosResponse } from 'axios';
import { EEnv } from '../config';
import { productService } from './product.service';

/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const paypalCheckoutSdk = require('@paypal/checkout-server-sdk');
const queryString = require('query-string');
const xml2js = require('xml2js');

export type Customer = {
    name: string;
    email: string;
    cpf: string;
    codeArea: number;
    phone: string;
}

const buildPayloadPaypal = (customer: Customer, order: Order, currency: string): object => {
    const costItems = order.items
      .map(item => item.quantity * item.product.priceWithDiscount)
      .reduce((p: number, c: number) => p + c);
    return {
        'intent': 'CAPTURE',
        'application_context': {
            'brand_name': 'YugiShop',
            'locale': 'pt-BT',
            'shipping_preference': 'SET_PROVIDED_ADDRESS',
            'user_action': 'CONTINUE'
        },
        'purchase_units': [
            {
                'reference_id': order.id,
                description: order.items.slice(0, 3)
                  .map(i => i.product.title)
                  .join(', '),
                'custom_id': order.id,
                'soft_descriptor': 'Yugi-Shop',
                amount: {
                    'currency_code': currency,
                    value: (costItems + order.costDelivery).toFixed(2),
                    breakdown: {
                        'item_total': {
                            'currency_code': currency,
                            value: costItems.toFixed(2)
                        },
                        shipping: {
                            'currency_code': currency,
                            value: order.costDelivery.toFixed(2)
                        }
                    }
                },
                items: order.items.map((item: ItemOrder) => {
                    return {
                        name: item.product.title,
                        description: item.product.desc,
                        quantity: item.quantity,
                        category: item.product.categories.length
                          ? item.product.categories
                            .map(c => c.title)
                            .join(', ')
                          : undefined,
                        'unit_amount': {
                            'currency_code': currency,
                            value: item.product.priceWithDiscount
                        }
                    };
                }),
                shipping: {
                    name: {
                        'full_name': customer.name
                    },
                    address: {
                        'address_line_1': `${order.addressTarget.number} ${order.addressTarget.street}`,
                        'admin_area_2': order.addressTarget.city,
                        'admin_area_1': order.addressTarget.state,
                        'postal_code': order.addressTarget.zipCode,
                        'country_code': 'BR'
                    }
                }
            }
        ]
    };
};

const getEnvironmentPaypal = (): object => {
    const clientId = config.paypal.clientId;
    const clientSecret = config.paypal.secret;

    // TODO: Substituir SandboxEnvironment por LiveEnvironment e credenciais de prod
    if (process.env.NODE_ENV === EEnv.PROD) {
        return new paypalCheckoutSdk.core.SandboxEnvironment(clientId, clientSecret);
    }

    return new paypalCheckoutSdk.core.SandboxEnvironment(clientId, clientSecret);
};

/*O ambiente sandbox só aceita emails com pós-fixo '@sandbox.pagseguro.com.br'*/
const _payWithPagSeguro = async (customer: Customer, orderInput: OrderInput): Promise<string> => {
    const orderId = (await orderService.create(orderInput, PaymentMethod.PAG_SEGURO)).id;
    const order = await orderService.findById(orderId) as Order;
    const url = `${config.pagSeguro.urlCheckout}?email=${config.pagSeguro.email}&token=${config.pagSeguro.token}`;
    const queryPostItems: any = {};

    order.items.forEach(({ product, quantity }: ItemOrder, index: number) => {
        queryPostItems[`itemId${index + 1}`] = product.id;
        queryPostItems[`itemDescription${index + 1}`] = product.title;
        queryPostItems[`itemAmount${index + 1}`] = productService.calculateRealPrice(product.price, product.percentOff)
          .toFixed(2);
        queryPostItems[`itemQuantity${index + 1}`] = quantity;
    });
    const queryPost = {
        // Dados de pagamento
        currency: 'BRL',
        receiverEmail: config.pagSeguro.email,
        extraAmount: '0.00',
        reference: order.id.toString(),

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
    const res = await axios.post(url, queryString.stringify(queryPost), configRequest);
    const arrMatchesIds = /<code>([\da-zA-Z]+)<\/code>/.exec(res.data);

    if (!arrMatchesIds) {
        throw new Error('Código da transação não foi retornado pelo PagSeguro. Contate o Administrador do sistema.');
    }

    const transactionId = arrMatchesIds[arrMatchesIds.length - 1];
    orderService.update(order.id, { transactionId });
    return transactionId;
};

const _payWithPaypal = async (customer: Customer, orderInput: OrderInput): Promise<string> => {
    try {
        const orderId = (await orderService.create(orderInput, PaymentMethod.PAYPAL)).id;
        const order = await orderService.findById(orderId, true) as Order;

        const request = new paypalCheckoutSdk.orders.OrdersCreateRequest();
        const payPalClient = new paypalCheckoutSdk.core.PayPalHttpClient(getEnvironmentPaypal());
        request.headers['prefer'] = 'return=representation';
        request.requestBody(buildPayloadPaypal(customer, order, 'BRL'));
        const response = await payPalClient.execute(request);
        await orderService.update(order.id, { transactionId: response.result.id });
        return response.result.id;
    } catch (e) {
        throw e;
    }
};

const _updateStatusPagSeguro = async (notifCode: string): Promise<void> => {
    const urlNotifGet = `${config.pagSeguro.urlGetNotific}/${notifCode}`;
    const urlGetNotif = `${urlNotifGet}?email=${config.pagSeguro.email}&token=${config.pagSeguro.token}`;
    let notificationXML;
    return axios.get(urlGetNotif)
      .then(async (response: AxiosResponse) => {
          notificationXML = response.data;
          const jsFromXML = (await xml2js.parseStringPromise(notificationXML)).transaction;
          const statusTransaction: PagSeguroStatusPayment = +(jsFromXML.status[0]);
          const mapTransacToPayment = new Map<PagSeguroStatusPayment, PaymentStatus>();
          mapTransacToPayment.set(PagSeguroStatusPayment.AGUARDANDO_PAGAMENTO, PaymentStatus.PENDING);
          mapTransacToPayment.set(PagSeguroStatusPayment.CANCELADA, PaymentStatus.CANCELED);
          mapTransacToPayment.set(PagSeguroStatusPayment.DEVOLVIDA, PaymentStatus.RETURNED);
          mapTransacToPayment.set(PagSeguroStatusPayment.DISPONIVEL, PaymentStatus.APPROVED);
          mapTransacToPayment.set(PagSeguroStatusPayment.EM_ANALISE, PaymentStatus.PENDING);
          const paymentStatus = mapTransacToPayment.get(statusTransaction);

          if (paymentStatus) {
              await orderService.update(jsFromXML.reference[0], { paymentStatus });
          }
      })
      .catch((err: Error) => {
          throw err;
      });
};

const _updateStatusPaypal = async (orderId: string): Promise<void> => {
    const order = await orderService.findById(orderId);
    const request = new paypalCheckoutSdk.orders.OrdersCaptureRequest(order?.transactionId);
    request.requestBody({});
    const payPalClient = new paypalCheckoutSdk.core.PayPalHttpClient(getEnvironmentPaypal());
    const response = await payPalClient.execute(request);
    const mapTransacToPayment = new Map<PayPalStatusPayment, PaymentStatus>();
    mapTransacToPayment.set(PayPalStatusPayment.COMPLETED, PaymentStatus.APPROVED);
    mapTransacToPayment.set(PayPalStatusPayment.DECLINED, PaymentStatus.CANCELED);
    mapTransacToPayment.set(PayPalStatusPayment.PENDING, PaymentStatus.PENDING);
    mapTransacToPayment.set(PayPalStatusPayment.REFUNDED, PaymentStatus.RETURNED);
    const paymentStatus = mapTransacToPayment.get(response.result.status);

    if (paymentStatus) {
        await orderService.update(orderId, { paymentStatus });
    }
};

export const paymentService = {
    payWithPagSeguro: _payWithPagSeguro,
    payWithPaypal: _payWithPaypal,
    updateStatusPagSeguro: _updateStatusPagSeguro,
    updateStatusPaypal: _updateStatusPaypal
};
