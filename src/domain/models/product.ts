'use strict';
import { Registable } from './auditable';
import { Category } from './category';
import { Dimension } from './shipping/dimension';

export interface Product extends ProductAdd, Registable {
    readonly avgReview: number;
    readonly categories: Category[];
    readonly priceWithDiscount: number;
}

export interface ProductAdd extends ProductPatch, Dimension {
    readonly quantity: number;
    readonly categoriesId: string[];
    readonly desc: string;
    readonly freeDelivery: boolean;
    readonly percentOff: number;
    readonly price: number;
    readonly title: string;
    readonly urlMainImage?: string;
    readonly mainImage?: Express.Multer.File;
    readonly cost: number;
    readonly height: number;
    readonly visible: boolean;
    readonly width: number;
    readonly length: number;
    readonly weight: number;
}

export interface ProductPatch {
    readonly categoriesId?: string[];
    readonly desc?: string;
    readonly freeDelivery?: boolean;
    readonly percentOff?: number;
    readonly price?: number;
    readonly title?: string;
    readonly urlMainImage?: string;
    readonly mainImage?: Express.Multer.File;
    readonly cost?: number;
    readonly height?: number;
    readonly visible?: boolean;
    readonly width?: number;
    readonly length?: number;
    readonly weight?: number;
}
