'use strict';
import { EUserRole } from '../enum/role.enum';

export interface TokenData {
    avatarUrl?: string;
    email: string;
    id: string;
    name: string;
    roles: EUserRole[];
}
