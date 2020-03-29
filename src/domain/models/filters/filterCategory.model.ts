'use strict';
import { FilterBasic } from '../../interfaces/filters/filterBasic.interface';

export class FilterCategory implements FilterBasic {
    text = '';

    countTotal = 0;
    currentPage = 1;
    dateEnd? = new Date();
    dateStart? = new Date(1900, 1, 1);
    perPage = 15;
}
