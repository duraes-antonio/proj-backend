'use strict';

import { ItemOrder, ItemOrderAdd } from './item-order';
import { Address } from './address';
import { EStateOrder, OrderOptionsSort } from '../enum/order';
import { DeliveryOptionType } from './shipping/delivery';
import { Registable } from './auditable';
import { PaymentMethod, PaymentStatus } from '../enum/payment';
import { FilterBasic } from './filters/filter-basic';

export interface OrderInput {
    readonly addressTargetId: string;
    readonly items: ItemOrderAdd[];
    readonly optionDeliveryType: DeliveryOptionType;
}

export interface OrderAdd extends OrderInput {
    readonly costDelivery: number;
    readonly daysForDelivery: number;
    readonly itemsId?: string[];
    readonly paymentMethod: PaymentMethod;
    readonly paymentStatus?: PaymentStatus;
    readonly transactionId?: string;
    readonly userId: string;
}

export interface Order extends OrderAdd, Registable {
    readonly addressTarget: Address;
    readonly dateDelivery?: Date;
    readonly items: ItemOrder[];
    readonly itemsId: string[];
    readonly productsId: string[];
    readonly paymentStatus: PaymentStatus;
    readonly state: EStateOrder;
    readonly transactionId: string;
}

export interface OrderPatch {
    readonly paymentStatus?: PaymentStatus;
    readonly state?: EStateOrder;
    readonly transactionId?: string;
}

export interface OrderForView extends Registable {
    customerName: string;
    customerUrlImg: string;
    costItems: number;
    costShipping: number;
    orderStatus: EStateOrder;
    paymentStatus: PaymentStatus;
}

export interface OrderFilterFilled extends FilterBasic {
    count: number;
    result: OrderForView[];
    sortBy?: OrderOptionsSort;
}
