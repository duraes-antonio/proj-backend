import { Document } from 'mongoose';
import { IAuditable } from './auditable.interface';
import { EUserRole } from '../enum/role.enum';

export interface IUser {
    readonly avatarUrl?: string;
    readonly email: string;
    readonly name: string;
    readonly password: string;
    readonly roles?: EUserRole;
}

export interface IUserSchema extends Document, IAuditable, IUser {
}
