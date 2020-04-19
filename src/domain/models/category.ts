'use strict';
import { Registable } from './auditable';

export interface Category extends Registable, CategoryAdd {
}

export interface CategoryAdd {
    readonly title: string;
}
