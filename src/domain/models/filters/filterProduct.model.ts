'use strict';
import { IFilterBasic } from '../../interfaces/filters/filterBasic.interface';

export class FilterProduct implements IFilterBasic {
    categoriesId: string[] = [];
    discounts: number[][] = [];
    freeDelivery = false;
    priceMin: number = 0;
    priceMax: number = Number.MAX_SAFE_INTEGER;
    avgReview: number[] = [];
    text = '';

    countTotal: number = 0;
    currentPage: number = 1;
    perPage: number = 15;
}
