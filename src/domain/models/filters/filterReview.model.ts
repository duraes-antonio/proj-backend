'use strict';
import { FilterBasic } from '../../interfaces/filters/filterBasic.interface';

export enum EReviewSort {
    OLDEST,
    NEWEST,
    RATING_HIGH,
    RATING_LOW
}

export class FilterReview implements FilterBasic {
    countTotal = 0;
    currentPage = 1;
    dateEnd? = new Date();
    dateStart? = new Date(1900, 1, 1);
    perPage = 5;
    sortBy: EReviewSort = EReviewSort.NEWEST;
}

