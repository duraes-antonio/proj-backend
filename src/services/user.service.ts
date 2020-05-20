import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msgServ } from '../shared/buildMsg';
import { userSizes } from '../shared/consts/fieldSize';
import { UserAdd, UserSearch } from '../domain/models/user';
import { userRepository } from '../data/repository/user.repository';
import { FilterUser } from '../domain/models/filters/filter-user';
import { UserOptionsSort } from '../domain/enum/user';

function validate(user: UserAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msgServ.empty, ignoreUndefined)
      .atLeastLen('name', user.name, userSizes.nameMin, msgServ.minLen)
      .atMaxLen('name', user.name, userSizes.nameMax, msgServ.maxLen)
      .validEmail('email', user.email, msgServ.invalidFormat)
      .atMaxLen('password', user.password, userSizes.passwordMax, msgServ.maxLen)
      .atLeastLen('password', user.password, userSizes.passwordMin, msgServ.minLen);
}

export const search = async (filter?: FilterUser): Promise<UserSearch> => {
    const newFilter: FilterUser = filter ?? {
        perPage: 15,
        currentPage: 1,
        sortBy: UserOptionsSort.NAME
    };
    return await userRepository.findForSearch(newFilter);
};

export const userService = {
    search,
    validate
};
