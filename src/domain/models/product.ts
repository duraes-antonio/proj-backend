'use strict';
import { Registable } from './auditable';

export interface Product extends ProductAdd, Registable {
    readonly avgReview: number;
    readonly priceWithDiscount: number;
    readonly visible: boolean;
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
    readonly cost: number;
    readonly height: number;
    readonly width: number;
    readonly length: number;
    readonly weight: number;
}
