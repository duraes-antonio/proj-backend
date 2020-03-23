'use strict';
import { IFilterBasic } from '../../interfaces/filters/filterBasic.interface';

export class FilterReview implements IFilterBasic {
    countTotal: number = 0;
    currentPage: number = 1;
    dateEnd? = new Date();
    dateStart? = new Date(1900, 1, 1);
    perPage: number = 5;
    sortBy: EReviewSort = EReviewSort.NEWEST;
}

export enum EReviewSort {
    OLDEST,
    NEWEST,
    RATING_HIGH,
    RATING_LOW
}
