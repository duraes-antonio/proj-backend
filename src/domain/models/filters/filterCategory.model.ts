'use strict';
import { IFilterBasic } from '../../interfaces/filters/filterBasic.interface';

export class FilterCategory implements IFilterBasic {
    categoriesId: string[] = [];
    text = '';

    countTotal: number = 0;
    currentPage: number = 1;
    dateEnd = new Date();
    dateStart = new Date(1900, 1, 1);
    perPage: number = 15;
}
