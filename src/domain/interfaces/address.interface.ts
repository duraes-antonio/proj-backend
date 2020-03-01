import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface IAddress extends Document, IAuditable {
	readonly street: string;
	readonly number: number;
	readonly zipCode: string;
	readonly neighborhood: string;
	readonly city: string;
	readonly state: string;
	readonly userId: string;
}
