import { Registable } from './auditable.interface';

export interface Address extends Registable {
    readonly street: string;
    readonly number: number;
    readonly zipCode: string;
    readonly neighborhood: string;
    readonly city: string;
    readonly state: string;
    readonly userId: string;
}

export interface AddressAdd {
    readonly street: string;
    readonly number: number;
    readonly zipCode: string;
    readonly neighborhood: string;
    readonly city: string;
    readonly state: string;
}
