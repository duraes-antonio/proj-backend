import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface ITokenInvalid extends IRegistable {
    readonly token: string;
    readonly userId: string;
}

export interface ITokenInvalidSchema extends Document, ITokenInvalid {
}
