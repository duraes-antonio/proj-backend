'use strict';
import { FilterBasic } from './filter-basic';
import { UserOptionsSort } from '../../enum/user';
import { EUserRole } from '../../enum/role';

export interface FilterUser extends FilterBasic {
    name?: string;
    dateEnd?: Date;
    dateStart?: Date;
    roles?: EUserRole[];
    sortBy?: UserOptionsSort;
}
