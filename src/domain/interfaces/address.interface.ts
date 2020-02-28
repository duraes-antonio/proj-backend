import { Document } from 'mongoose';

export interface IAddress extends Document {
	readonly street: string;
	readonly number: number;
	readonly zipCode: string;
	readonly neighborhood: string;
	readonly city: string;
	readonly state: string;
}
