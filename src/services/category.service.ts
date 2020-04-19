import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { categorySizes } from '../shared/fieldSize';
import { CategoryAdd } from '../domain/models/category';

function validate(category: CategoryAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atLeastLen('title', category.title, categorySizes.titleMin, msg.minLen)
      .atMaxLen('title', category.title, categorySizes.titleMax, msg.maxLen);
}

export const categoryService = {
    validate
};
