'use strict';

import { EUserRole } from '../../enum/role';
import { Registable } from '../auditable';

export interface ListPatch {
    readonly itemsId?: string[];
    readonly title?: string;
    readonly readRole?: EUserRole;
}

export interface ListAdd<T> {
    readonly items?: T[];
    readonly itemsId: string[];
    readonly title: string;
    readonly readRole: EUserRole;
}

export interface List<T> extends ListAdd<T>, Registable {
    readonly items: T[];
}
