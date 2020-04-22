'use strict';
import { Registable } from '../auditable';

export interface SlideAdd {
    readonly btnTitle?: string;
    readonly desc?: string;
    readonly imageUrl: string;
    readonly title?: string;
    readonly url: string;
    readonly index: number;
}

export interface Slide extends SlideAdd, Registable {
}
