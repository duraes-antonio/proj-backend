'use strict';

import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface ICategory {
    readonly name: string;
}

export interface ICategorySchema extends Document, IAuditable, ICategory {
}
