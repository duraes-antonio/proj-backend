'use strict';

import { Document } from 'mongoose';
import { ICategory } from './category.interface';
import { IAuditable } from './auditable.interface';

export interface IProduct {
    readonly title: string;
    readonly desc: string;
    readonly urlMainImage?: string;

    readonly price: number;
    readonly priceWithDiscount: number;
    readonly percentOff: number;

    readonly freeDelivery: boolean;
    readonly categories: ICategory[];
    readonly avgReview: number;
    readonly amountAvailable: number;
}

export interface IProductSchema extends Document, IAuditable, IProduct {
}
