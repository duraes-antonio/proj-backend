'use strict';
import { Registable } from './auditable';
import { EUserRole } from '../enum/role.enum';

export interface User extends Registable, UserAdd {
    readonly avatarUrl?: string;
}

export interface UserAdd {
    readonly email: string;
    readonly phone: string;
    readonly cpf: string;
    readonly name: string;
    readonly codeArea: number;
    readonly password: string;
    readonly roles: EUserRole[];
}
