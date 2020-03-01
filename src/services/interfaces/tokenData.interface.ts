'use strict';

import { EUserRole } from '../../domain/enum/role.enum';

export interface ITokenData {
    id: string;
    email: string;
    name: string;
    roles: EUserRole[];
}
