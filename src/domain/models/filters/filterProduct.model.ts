'use strict';
import { FilterBasic } from './filterBasic.interface';
import { EProductSort } from '../../enum/productSort.enum';

export class FilterProduct implements FilterBasic {
    avgReview?: number[] = [];
    categoriesId?: string[] = [];
    discounts?: number[][] = [];
    freeDelivery?: boolean = false;
    ids?: string[] = [];
    priceMax?: number;
    priceMin?: number;
    text? = '';
    sortBy?: EProductSort = EProductSort.DEFAULT;

    countTotal = 0;
    currentPage = 1;
    perPage = 15;
}
