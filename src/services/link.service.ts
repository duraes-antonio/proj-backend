import { LinkAdd } from '../domain/models/link';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { linkSizes } from '../shared/fieldSize';

function validate(data: LinkAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('Title', data.title, linkSizes.titleMin, msg.minLen)
      .atMaxLen('Title', data.title, linkSizes.titleMax, msg.maxLen)
      .atLeastLen('Url', data.url, linkSizes.urlMin, msg.minLen)
      .atMaxLen('Url', data.url, linkSizes.urlMax, msg.maxLen);
}

export const linkService = {
    validate
};
