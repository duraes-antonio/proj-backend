'use strict';

import { ItemOrder, ItemOrderAdd } from './item-order';
import { Address } from './address';
import { EStateOrder } from '../enum/state-order';
import { DeliveryOptionType } from './shipping/delivery';
import { Registable } from './auditable';
import { PaymentMethod, PaymentStatus } from '../enum/payment';

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
    readonly paymentStatus: PaymentStatus;
    readonly state: EStateOrder;
    readonly transactionId: string;
}

export interface OrderPatch {
    readonly paymentStatus?: PaymentStatus;
    readonly state?: EStateOrder;
    readonly transactionId?: string;
}
