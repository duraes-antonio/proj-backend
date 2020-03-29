'use strict';

import { EUserRole } from '../../domain/enum/role.enum';

export interface TokenData {
    id: string;
    email: string;
    name: string;
    roles: EUserRole[];
}
