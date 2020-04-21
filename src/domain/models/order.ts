'use strict';

import { ItemOrder } from './item-order';
import { Address } from './address';
import { EStateOrder } from '../enum/state-order';

export interface Order {
    readonly id: number;
    readonly items: ItemOrder[];
    readonly date: Date;
    readonly state: EStateOrder;

    readonly costDelivery: number;
    readonly daysForDelivery: number;
    readonly addressTarget: Address;
    readonly dateDelivery?: Date;
}
