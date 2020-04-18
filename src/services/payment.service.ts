import { Order } from '../domain/models/order';
import { Product } from '../domain/models/product';
import paypal from 'paypal-rest-sdk';
import { productRepository } from '../data/repository/product.repository';

const ppConfig = {
    mode: 'sandbox',
    ppSandboxAcc: 'sb-1guzs1303671@business.example.com',
    token: 'access_token$sandbox$hj8cqm69twn66kkz$6d5682a1fe62837ab5987ff2a1403b5b',
    clientId: 'AXg0OUZI4L1NOOWjPyQM-WRBA-gmkNJU4dn0ZZKDbgZ08UF-DaqIQbv0afTG5NrrEW15GmAx94nXuqeo',
    secret: 'EHc8BkuG7LR92TxIshn6lE4I6aPa0axwYp5f1M3QFImlnMHN6pQwPd-qj64mZvUSU4UBma_AzRHLBQuv'
};

async function payItemsPaypal(order: Order): Promise<void> {
    /*TODO:
       - Adicionar items a uma cesta;
       - Calcular preço de cada item;
       - Calcular preço de entrega de cada item;
       - Total (custo de entrega + custo de itens)
       */
    // TODO: Obter produtos
    if (!order.date) {
        order = {
            ...order,
            date: new Date()
        };
    }
    const prods: Product[] = await productRepository.find(
      {
          countTotal: 0,
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
              .amount
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
            'description': `${prods.length} itens - em ${order.date.toLocaleString()}`
        }]
    };
    const paypalConfig = paypal.configure({
        'client_id': ppConfig.clientId,
        'client_secret': ppConfig.secret,
        'mode': ppConfig.mode
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
}

export const paymentService = {
    payItemsPaypal: payItemsPaypal
};
