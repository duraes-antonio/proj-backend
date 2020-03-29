'use strict';

import { ItemOrder } from './itemOrder.interface';
import { Address } from './address.interface';
import { EStateOrder } from '../enum/stateOrder';

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
