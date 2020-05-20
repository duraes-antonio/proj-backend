'use strict';

import { UserSchema } from '../schemas/user.schema';
import { User, UserSearch } from '../../domain/models/user';
import { repositoryFunctions as repoFns } from '../repository.functions';
import { FilterUser } from '../../domain/models/filters/filter-user';
import { mongoQueryUtils as queryUtil } from '../mongo-query-utils';
import { UserOptionsSort } from '../../domain/enum/user';
import { ECollectionsName } from '../collections-name.enum';

const userOptionsSortObject: { [key in UserOptionsSort]: { [key: string]: number } } = {
    [UserOptionsSort.NAME]: { 'name': 1 },
    [UserOptionsSort.NEWEST]: { 'createdAt': -11 },
    [UserOptionsSort.OLDEST]: { 'createdAt': 1 },
    [UserOptionsSort.QUANTITY_PURCHASES]: { 'quantityPurchases': -1 }
};

async function findByEmail(email: string): Promise<User | null> {
    const user = await UserSchema.findOne({ email: email }).lean();
    return user ? repoFns.insertFieldId(user) : user;
}

async function hasWithEmail(email: string): Promise<boolean> {
    return UserSchema.exists({ email: email });
}

const _findForSearch = async (filter: FilterUser): Promise<UserSearch> => {
    const queryFindConditions = {
        ...queryUtil.buildTextFilter(filter.name),
        ...queryUtil.buildDateFilter('createdAt', filter.dateStart, filter.dateEnd),
        ...queryUtil.buildInArrayFilter('roles', filter.roles)
    };
    const countUsersMathes = await UserSchema.countDocuments(queryFindConditions);
    const users = await UserSchema
      .aggregate()
      .match(queryFindConditions)
      .lookup({
          from: ECollectionsName.ORDER,
          localField: '_id',
          foreignField: 'userId',
          as: 'orders'
      })
      .sort(userOptionsSortObject[filter.sortBy ?? UserOptionsSort.NEWEST]);
    return {
        ...filter,
        count: countUsersMathes,
        result: []
    };
};

export const userRepository = {
    findByEmail: findByEmail,
    hasWithEmail: hasWithEmail,
    findForSearch: _findForSearch
};
