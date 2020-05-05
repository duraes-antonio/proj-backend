'use strict';
import { FilterBasic } from './filter-basic';
import { EProductSort } from '../../enum/product-sort';

export interface FilterProduct extends FilterBasic {
    avgReview?: number[];
    categoriesId?: string | string[];
    discounts?: number[][];
    freeDelivery?: boolean;
    ids?: string | string[];
    priceMax?: number;
    priceMin?: number;
    text?: string;
    sortBy?: EProductSort;
}
