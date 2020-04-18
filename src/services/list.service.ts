import { ListAdd } from '../domain/interfaces/lists/list';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { listSizes } from '../shared/fieldSize';

function validateListAdd<T>(list: ListAdd<T>, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atMaxLenList('ItemsId', list.itemsId, listSizes.lengthMax, msg.maxLenList)
      .atLeastLen('Title', list.title, listSizes.titleMin, msg.minLen)
      .atMaxLen('Title', list.title, listSizes.titleMax, msg.maxLen);
}

export const listService = {
    validateListAdd: validateListAdd
};
