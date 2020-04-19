'use strict';
import { Registable } from './auditable';

export interface Review extends Registable, ReviewAdd {
    readonly date: Date;
    readonly userId: string;
}

export interface ReviewAdd {
    readonly comment: string;
    readonly rating: number;
    readonly title: string;
    readonly productId: string;
}

export interface ReviewPatch {
    readonly comment?: string;
    readonly rating?: number;
    readonly title?: string;
}
