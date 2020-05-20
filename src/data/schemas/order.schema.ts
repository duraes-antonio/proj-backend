'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { orderSizes } from '../../shared/consts/fieldSize';
import { ECollectionsName } from '../collections-name.enum';
import { Order } from '../../domain/models/order';
import { EStateOrder } from '../../domain/enum/order';
import { DeliveryOptionType } from '../../domain/models/shipping/delivery';
import { PaymentMethod, PaymentStatus } from '../../domain/enum/payment';

const orderSchema = new Schema({

    addressTargetId: {
        ref: ECollectionsName.ADDRESS,
        required: true,
        type: Schema.Types.ObjectId
    },
    costDelivery: {
        default: 0,
        min: orderSizes.costDeliveryMin,
        max: orderSizes.costDeliveryMax,
        required: true,
        type: Number
    },
    dateDelivery: {
        required: false,
        type: Date
    },
    daysForDelivery: {
        min: orderSizes.daysForDeliveryMin,
        max: orderSizes.daysForDeliveryMax,
        required: true,
        type: Number
    },
    itemsId: {
        minlength: 1,
        ref: ECollectionsName.ITEM_ORDER,
        required: true,
        type: [Schema.Types.ObjectId]
    },
    optionDeliveryType: {
        enum: Object.values(DeliveryOptionType),
        required: true,
        type: String
    },
    paymentMethod: {
        enum: Object.values(PaymentMethod),
        required: true,
        type: String
    },
    paymentStatus: {
        default: PaymentStatus.CREATED,
        enum: Object.values(PaymentStatus),
        required: true,
        type: String
    },
    productsId: {
        minlength: 1,
        ref: ECollectionsName.PRODUCT,
        required: true,
        type: [Schema.Types.ObjectId]
    },
    state: {
        default: EStateOrder.CREATED,
        enum: Object.values(EStateOrder),
        required: true,
        type: String
    },
    transactionId: {
        required: false,
        type: String
    },
    userId: {
        ref: ECollectionsName.USER,
        required: true,
        type: Schema.Types.ObjectId
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

orderSchema.virtual(
  'items',
  {
      foreignField: '_id',
      localField: 'itemsId',
      ref: ECollectionsName.ITEM_ORDER
  });
orderSchema.virtual(
  'addressTarget',
  {
      foreignField: '_id',
      justOne: true,
      localField: 'addressTargetId',
      ref: ECollectionsName.ADDRESS
  });
orderSchema.virtual(
  'user',
  {
      foreignField: '_id',
      justOne: true,
      localField: 'userId',
      ref: ECollectionsName.USER
  });

export const OrderSchema: Model<OrderDBModel> = model<OrderDBModel>(ECollectionsName.ORDER, orderSchema);

export interface OrderDBModel extends Document, Order {
}
