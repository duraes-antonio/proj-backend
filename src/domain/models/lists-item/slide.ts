'use strict';
import { Registable } from '../auditable';

export interface SlidePatch {
    readonly index?: number;
    readonly title?: string;
    readonly url?: string;
}

export interface SlideBase {
    readonly index: number;
    readonly title: string;
    readonly url: string;
}

export interface Slide extends SlideBase, Registable {
    readonly imageUrl?: string;
}
