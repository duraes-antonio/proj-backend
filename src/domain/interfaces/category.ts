'use strict';

import { Registable } from './auditable';

export interface Category extends Registable {
    readonly title: string;
}

export interface CategoryAdd {
    readonly title: string;
}
