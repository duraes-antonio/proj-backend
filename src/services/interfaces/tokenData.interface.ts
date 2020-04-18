'use strict';

import { EUserRole } from '../../domain/enum/role.enum';

export interface TokenData {
    avatarUrl?: string;
    email: string;
    id: string;
    name: string;
    roles: EUserRole[];
}
