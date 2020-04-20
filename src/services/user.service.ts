import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msgServ } from '../shared/buildMsg';
import { userSizes } from '../shared/fieldSize';
import { UserAdd } from '../domain/models/user';

function validate(user: UserAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msgServ.empty, ignoreUndefined)
      .atLeastLen('name', user.name, userSizes.nameMin, msgServ.minLen)
      .atMaxLen('name', user.name, userSizes.nameMax, msgServ.maxLen)
      .validEmail('email', user.email, msgServ.invalidFormat)
      .atMaxLen('password', user.password, userSizes.passwordMax, msgServ.maxLen)
      .atLeastLen('password', user.password, userSizes.passwordMin, msgServ.minLen);
}

export const userService = {
    validate
};
