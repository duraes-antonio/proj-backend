import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';

export interface IAddress extends IRegistable {
    readonly street: string;
    readonly number: number;
    readonly zipCode: string;
    readonly neighborhood: string;
    readonly city: string;
    readonly state: string;
    readonly userId: string;
}

export interface IAddressSchema extends Document, IAddress {
}
