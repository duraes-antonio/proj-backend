'use strict';
import { Registable } from './auditable';
import { EUserRole } from '../enum/role';
import { FilterBasic } from './filters/filter-basic';
import { UserOptionsSort } from '../enum/user';

export interface User extends Registable, UserAdd {
    readonly avatarUrl?: string;
}

export interface UserPatch {
    readonly avatarUrl?: string;
    readonly codeArea?: number;
    readonly name?: string;
    readonly password?: string;
    readonly phone?: string;
    readonly roles?: EUserRole[];
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

export interface UserViewModel extends Registable {
    readonly avatarUrl?: string;
    readonly name: string;
    readonly roles: EUserRole[];
    readonly quantityPurchases: number;
}

export interface UserSearch extends FilterBasic {
    count: number;
    result: UserViewModel[];
    sortBy?: UserOptionsSort;
}
