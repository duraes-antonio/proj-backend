import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface ITokenInvalid {
    readonly token: string;
    readonly userId: string;
}

export interface ITokenInvalidSchema extends Document, IAuditable, ITokenInvalid {
}
