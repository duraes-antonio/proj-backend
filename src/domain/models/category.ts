'use strict';
import { Registable } from './auditable';
import { FilterBasic } from './filters/filter-basic';
import { ECategorySort } from '../enum/category-sort';

export interface Category extends Registable, CategoryAdd {
}

export interface CategoryAdd {
    readonly title: string;
}

export interface CategoryProductPreview {
    readonly title: string;
    readonly urlImage?: string;
}

export interface CategoryForView extends Category {
    productsQuantity: number;
    productPreview?: CategoryProductPreview[];
}

export interface CategoryFilterFilled extends FilterBasic {
    count: number;
    result: CategoryForView[];
    sortBy?: ECategorySort;
    text?: string;
}
