import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface IUser extends Document, IAuditable {
	readonly avatarUrl: string;
	readonly email: string;
	readonly name: string;
	readonly password: string;
}
