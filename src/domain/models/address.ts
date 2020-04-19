import { Registable } from './auditable';

export interface AddressAdd {
    readonly street: string;
    readonly number: number;
    readonly zipCode: string;
    readonly neighborhood: string;
    readonly city: string;
    readonly state: string;
}

export interface Address extends Registable, AddressAdd {
    readonly userId: string;
}

export interface AddressPatch {
    readonly street?: string;
    readonly number?: number;
    readonly zipCode?: string;
    readonly neighborhood?: string;
    readonly city?: string;
    readonly state?: string;
}
