'use strict';
import { UserSchema } from '../schemas/user.schema';
import { User, UserPatch, UserSearch } from '../../domain/models/user';
import { repositoryFunctions as repoFns } from '../repository.functions';
import { FilterUser } from '../../domain/models/filters/filter-user';
import { mongoQueryUtils as queryUtil } from '../mongo-query-utils';
import { UserOptionsSort } from '../../domain/enum/user';
import { ECollectionsName } from '../collections-name.enum';

const userOptionsSortObject: { [key in UserOptionsSort]: { [key: string]: number } } = {
    [UserOptionsSort.NAME]: { 'name': 1 },
    [UserOptionsSort.NEWEST]: { 'createdAt': -1 },
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
        ...queryUtil.buildTextFilter(filter.text),
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
      .project({
          avatarUrl: 1,
          createdAt: 1,
          id: '$_id',
          _id: 0,
          name: 1,
          roles: 1,
          quantityPurchases: { $size: '$orders' }
      })
      .sort(userOptionsSortObject[filter.sortBy ?? UserOptionsSort.NEWEST])
      .skip(queryUtil.buildSkipParam(filter.perPage, filter.currentPage))
      .limit(queryUtil.buildLimitParam(filter.perPage));
    return {
        ...filter,
        count: countUsersMathes,
        result: users
    };
};

const _update = async (id: string, userPatch: UserPatch): Promise<User | null> => {
    return repoFns.findAndUpdate(id, userPatch, UserSchema);
};

export const userRepository = {
    findByEmail: findByEmail,
    hasWithEmail: hasWithEmail,
    findForSearch: _findForSearch,
    update: _update
};
