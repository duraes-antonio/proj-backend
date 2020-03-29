'use strict';

import { Registable } from './auditable.interface';

export interface Category extends Registable {
    readonly title: string;
}

export interface CategoryAdd {
    readonly title: string;
}
