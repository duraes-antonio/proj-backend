'use strict';

export interface ItemOrder {
    readonly id: number;
    readonly amount: number;
    readonly unitPrice: number;
    readonly productId: number;
}
