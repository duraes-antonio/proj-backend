'use strict';
import { FilterBasic } from './filter-basic';

export enum EReviewSort {
    OLDEST,
    NEWEST,
    RATING_HIGH,
    RATING_LOW
}

export interface FilterReview extends FilterBasic {
    productId?: string;
    sortBy: EReviewSort;
}

