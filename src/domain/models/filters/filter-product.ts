'use strict';
import { FilterBasic } from './filter-basic';
import { EProductSort } from '../../enum/productSort.enum';

export interface FilterProduct extends FilterBasic {
    avgReview?: number[];
    categoriesId?: string[];
    discounts?: number[][];
    freeDelivery?: boolean;
    ids?: string[];
    priceMax?: number;
    priceMin?: number;
    text?: string;
    sortBy?: EProductSort;
}
