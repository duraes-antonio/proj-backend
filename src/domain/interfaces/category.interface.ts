'use strict';

import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface ICategory extends IRegistable {
    readonly title: string;
}

export interface ICategorySchema extends Document, ICategory {
}
