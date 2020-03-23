'use strict';

import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface IReview extends IRegistable {
    readonly comment: string;
    readonly date: Date;
    readonly rating: number;
    readonly title: string;
    readonly productId: string;
    readonly userId: string;
}

export interface IReviewSchema extends Document, IReview { }
