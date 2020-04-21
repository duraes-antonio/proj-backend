'use strict';
import { Registable } from './auditable';

export interface LinkAdd {
    readonly title: string;
    readonly url: string;
}

export interface Link extends LinkAdd, Registable {
}
