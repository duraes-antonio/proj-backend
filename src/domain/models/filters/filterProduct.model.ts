'use strict';
import { IFilterBasic } from '../../interfaces/filters/filterBasic.interface';
import { EProductSort } from '../../enum/productSort.enum';

export class FilterProduct implements IFilterBasic {
    avgReview: number[] = [];
    categoriesId: string[] = [];
    discounts: number[][] = [];
    freeDelivery?: boolean = false;
    priceMax?: number;
    priceMin?: number;
    text = '';
    sortBy: EProductSort = EProductSort.DEFAULT;

    countTotal: number = 0;
    currentPage: number = 1;
    perPage: number = 15;
}
