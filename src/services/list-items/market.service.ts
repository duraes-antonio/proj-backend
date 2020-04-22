import { PipelineValidation } from '../../shared/validations';
import { validationErrorMsg as msg } from '../../shared/buildMsg';
import { MarketAdd } from '../../domain/models/lists-item/market';
import { marketSizes } from '../../shared/fieldSize';

function validate(data: MarketAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('AvatarUrl', data.avatarUrl, marketSizes.avatarUrlMin, msg.minLen)
      .atMaxLen('AvatarUrl', data.avatarUrl, marketSizes.avatarUrlMax, msg.maxLen)
      .atLeastLen('BackgroundUrl', data.backgroundUrl, marketSizes.backgroundUrlMin, msg.minLen)
      .atMaxLen('BackgroundUrl', data.backgroundUrl, marketSizes.backgroundUrlMax, msg.maxLen)
      .atLeastValue('Index', data.index, marketSizes.indexMin, msg.minValue)
      .atMaxValue('Index', data.index, marketSizes.indexMax, msg.maxValue)
      .atLeastLen('Name', data.name, marketSizes.nameMin, msg.minLen)
      .atMaxLen('Name', data.name, marketSizes.nameMax, msg.maxLen)
      .atLeastLen('Url', data.url, marketSizes.urlMin, msg.minLen)
      .atMaxLen('Url', data.url, marketSizes.urlMax, msg.maxLen);
}

export const marketService = {
    validate
};
