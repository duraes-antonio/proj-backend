'use strict';

import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface ICategory {
    readonly createDate?: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly title: string;
}

export interface ICategorySchema extends Document, IAuditable, ICategory {
}
