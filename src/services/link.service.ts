import { Link, LinkAdd } from '../domain/interfaces/link';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { linkSizes } from '../shared/fieldSize';

function validate(data: Link | LinkAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atLeastLen('Title', data.title, linkSizes.titleMax, msg.minLen)
      .atMaxLen('Title', data.title, linkSizes.titleMax, msg.maxLen);
}
