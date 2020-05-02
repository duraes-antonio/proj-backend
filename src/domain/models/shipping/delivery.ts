'use strict';
import { Dimension } from './dimension';
import { ItemOrderAdd } from '../item-order';

export enum DeliveryOptionType {
    PAC = 'PAC',
    SEDEX = 'SEDEX'
}

export interface DeliveryEstimativeInput {
    zipcodeOrigin: string;
    zipcodeTarget: string;
    itemsOrder: ItemOrderAdd[];
}

export interface DeliveryOption {
    readonly cost: number;
    readonly timeDays: number;
    readonly typeService: DeliveryOptionType;
}

export interface Deliverable extends Dimension {
    readonly amount: number;
}
