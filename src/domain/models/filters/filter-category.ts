'use strict';
import { FilterBasic } from './filter-basic';
import { ECategorySort } from '../../enum/category-sort';

export interface FilterCategory extends FilterBasic {
    sortBy?: ECategorySort;
    text: string;
}
