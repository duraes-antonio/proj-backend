'use strict';

import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface IProduct extends IRegistable {
    readonly title: string;
    readonly desc: string;
    readonly urlMainImage?: string;

    readonly price: number;
    readonly percentOff: number;

    readonly freeDelivery: boolean;
    readonly categoriesId: string[];
    readonly avgReview: number;
    readonly amountAvailable: number;
}

export interface IProductSchema extends Document, IProduct {
    readonly priceWithDiscount: number;
}
