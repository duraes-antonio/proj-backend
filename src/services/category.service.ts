import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { categorySizes } from '../shared/fieldSize';
import { CategoryAdd, CategoryFilterFilled } from '../domain/models/category';
import { FilterCategory } from '../domain/models/filters/filter-category';
import { categoryRepository } from '../data/repository/category.repository';

function validate(category: CategoryAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atLeastLen('title', category.title, categorySizes.titleMin, msg.minLen)
      .atMaxLen('title', category.title, categorySizes.titleMax, msg.maxLen);
}

const _getFilter = async (filter?: FilterCategory): Promise<CategoryFilterFilled> => {
    return await categoryRepository.findFilterData(filter);
};


export const categoryService = {
    getFilter: _getFilter,
    validate
};
