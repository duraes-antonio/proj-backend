import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface IAddress {
    readonly street: string;
    readonly number: number;
    readonly zipCode: string;
    readonly neighborhood: string;
    readonly city: string;
    readonly state: string;
    readonly userId: string;
}

export interface IAddressSchema extends Document, IAuditable, IAddress {
}
