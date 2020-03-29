'use strict';
import { Registable } from './auditable.interface';

export interface Review extends Registable {
    readonly comment: string;
    readonly date: Date;
    readonly rating: number;
    readonly title: string;
    readonly productId: string;
    readonly userId: string;
}
