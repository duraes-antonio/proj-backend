'use strict';
import { Registable } from './auditable.interface';

export interface Product extends ProductAdd, Registable {
    readonly avgReview: number;
    readonly priceWithDiscount: number;
}

export interface ProductAdd {
    readonly amountAvailable: number;
    readonly categoriesId: string[];
    readonly desc: string;
    readonly freeDelivery: boolean;
    readonly percentOff: number;
    readonly price: number;
    readonly title: string;
    readonly urlMainImage?: string;
}
