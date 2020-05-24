'use strict';
import { OrderSchema } from '../schemas/order.schema';
import { FilterOrder } from '../../domain/models/filters/filter-order';
import { OrderFilterFilled } from '../../domain/models/order';
import { OrderOptionsSort } from '../../domain/enum/order';
import { ECollectionsName } from '../collections-name.enum';
import { mongoQueryUtils } from '../mongo-query-utils';

export enum DirectionSort {
    ASCENDING,
    DESCENDING
}


const _productPurchased = async (userId: string, productId: string): Promise<boolean> => {
    return await OrderSchema.exists({
        $and: [
            { userId },
            { productsId: { $in: [productId] } }
        ]
    });
};

const _findFilterData = async (filter: FilterOrder): Promise<OrderFilterFilled> => {
    const sortOptionColumn: { [key in OrderOptionsSort]: { [key: string]: number } } = {
        [OrderOptionsSort.CLIENT_NAME]: { customerName: 1 },
        [OrderOptionsSort.COST_ITEMS]: { costItems: -1 },
        [OrderOptionsSort.COST_SHIPPING]: { costShipping: -1 },
        [OrderOptionsSort.NEWEST]: { createdAt: -1 },
        [OrderOptionsSort.OLDEST]: { createdAt: 1 },
        [OrderOptionsSort.ORDER_STATUS]: { orderStatus: 1 },
        [OrderOptionsSort.PAYMENT_STATUS]: { paymentStatus: 1 }
    };

    try {
        const sortParam: OrderOptionsSort = filter.sortBy ?? OrderOptionsSort.NEWEST;
        const orders = await OrderSchema
          .aggregate([
              {
                  $match: {
                      ...mongoQueryUtils.buildSimpleParam('state', filter.orderStatus),
                      ...mongoQueryUtils.buildSimpleParam('paymentStatus', filter.paymentStatus),
                      ...mongoQueryUtils.buildDateFilter('createdAt', filter.dateStart, filter.dateEnd)
                  }
              },
              {
                  $lookup: {
                      from: ECollectionsName.USER,
                      let: { userWantedId: '$userId' },
                      pipeline: [
                          {
                              $match:
                                {
                                    ...mongoQueryUtils.buildTextFilter(filter.clientName),
                                    $expr:
                                      {
                                          $and: [
                                              { $eq: ['$_id', '$$userWantedId'] }
                                          ]
                                      }
                                }
                          },
                          {
                              $project: {
                                  customerName: '$name',
                                  avatarUrl: '$avatarUrl'
                              }
                          }
                      ],
                      as: 'user'
                  }
              },
              { $unwind: '$user' },
              { $unwind: '$itemsId' },
              {
                  $lookup: {
                      from: ECollectionsName.ITEM_ORDER,
                      let: { localItemId: '$itemsId' },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $and: [
                                          { $eq: ['$_id', '$$localItemId'] }
                                      ]
                                  }
                              }
                          },
                          {
                              $project: {
                                  costItem: { $multiply: ['$unitPrice', '$quantity'] }
                              }
                          }
                      ],
                      as: 'items'
                  }
              },
              { $unwind: '$items' },
              {
                  $project: {
                      id: '$_id',
                      createdAt: 1,
                      customerName: '$user.customerName',
                      customerUrlImg: '$user.avatarUrl',
                      costItems: { $sum: '$items.costItem' },
                      costShipping: '$costDelivery',
                      orderStatus: '$state',
                      paymentStatus: 1
                  }
              }
          ])
          .sort(sortOptionColumn[sortParam]);
        return {
            ...filter,
            count: orders.length,
            result: orders.slice(
              (filter.currentPage - 1) * filter.perPage,
              (filter.currentPage) * filter.perPage
            )
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const orderRepository = {
    productPurchased: _productPurchased,
    findFilterData: _findFilterData
};
