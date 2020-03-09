'use strict';

import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface IProduct extends IRegistable {
    readonly amountAvailable: number;
    readonly avgReview: number;
    readonly categoriesId: string[];
    readonly desc: string;
    readonly freeDelivery: boolean;
    readonly percentOff: number;
    readonly price: number;
    readonly title: string;
    readonly urlMainImage?: string;
}

export interface IProductSchema extends Document, IProduct {
    readonly priceWithDiscount: number;
}
