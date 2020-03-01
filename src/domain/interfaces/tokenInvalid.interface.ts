import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';

export interface ITokenInvalid extends Document, IAuditable {
	readonly token: string;
	readonly userId: string;
}
