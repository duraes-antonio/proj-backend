'use strict';
import { IFilterBasic } from '../../interfaces/filters/filterBasic.interface';

export class FilterProduct implements IFilterBasic {
    avgReview: number[] = [];
    categoriesId: string[] = [];
    discounts: number[][] = [];
    freeDelivery = false;
    priceMax: number = Number.MAX_SAFE_INTEGER;
    priceMin: number = 0;
    text = '';

    countTotal: number = 0;
    currentPage: number = 1;
    perPage: number = 15;
    dateEnd?: Date;
    dateStart?: Date;
}
