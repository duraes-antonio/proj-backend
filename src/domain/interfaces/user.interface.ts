import { Document } from 'mongoose';
import { IRegistable } from './auditable.interface';
import { EUserRole } from '../enum/role.enum';

export interface IUser extends IRegistable {
    readonly avatarUrl?: string;
    readonly email: string;
    readonly name: string;
    readonly password: string;
    readonly roles?: EUserRole[];
}

export interface IUserSchema extends Document, IUser {
}
