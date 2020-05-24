import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msgServ } from '../shared/buildMsg';
import { userSizes } from '../shared/consts/fieldSize';
import { User, UserAdd, UserPatch, UserSearch } from '../domain/models/user';
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

const _search = async (filter?: FilterUser): Promise<UserSearch> => {
    const newFilter: FilterUser = filter ?? ({
        perPage: 15,
        currentPage: 1,
        sortBy: UserOptionsSort.NAME
    });
    return userRepository.findForSearch(newFilter);
};

const _update = async (id: string, userPatch: UserPatch): Promise<User | null> => {
    return userRepository.update(id, userPatch);
};

export const userService = {
    search: _search,
    update: _update,
    validate
};
