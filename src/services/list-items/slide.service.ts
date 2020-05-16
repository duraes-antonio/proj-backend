import { PipelineValidation } from '../../shared/validations';
import { validationErrorMsg as msg } from '../../shared/buildMsg';
import { SlideAdd } from '../../domain/models/lists-item/slide';
import { slideSizes } from '../../shared/consts/fieldSize';

function validate(data: SlideAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('BtnTitle', data.btnTitle, slideSizes.btnTitleMin, msg.minLen)
      .atMaxLen('BtnTitle', data.btnTitle, slideSizes.btnTitleMax, msg.maxLen)
      .atLeastLen('Desc', data.desc, slideSizes.descMin, msg.minLen)
      .atMaxLen('Desc', data.desc, slideSizes.descMax, msg.maxLen)
      .atLeastLen('ImageUrl', data.imageUrl, slideSizes.imageUrlMin, msg.minLen)
      .atMaxLen('ImageUrl', data.imageUrl, slideSizes.imageUrlMax, msg.maxLen)
      .atLeastValue('Index', data.index, slideSizes.indexMin, msg.minValue)
      .atMaxValue('Index', data.index, slideSizes.indexMax, msg.maxValue)
      .atLeastLen('Title', data.title, slideSizes.titleMin, msg.minLen)
      .atMaxLen('Title', data.title, slideSizes.titleMax, msg.maxLen)
      .atLeastLen('Url', data.url, slideSizes.urlMin, msg.minLen)
      .atMaxLen('Url', data.url, slideSizes.urlMax, msg.maxLen);
}

export const slideService = {
    validate
};
