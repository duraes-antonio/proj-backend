import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { productSizes as prodSizes } from '../shared/fieldSize';
import { ProductAdd } from '../domain/models/product';

function validate<T>(prod: ProductAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('title', prod.title, prodSizes.titleMin, msg.minLen)
      .atMaxLen('title', prod.title, prodSizes.titleMax, msg.maxLen)
      .atLeastLen('desc', prod.desc, prodSizes.descMin, msg.minLen)
      .atMaxLen('desc', prod.desc, prodSizes.descMax, msg.maxLen)

      .atLeastValue('price', prod.price, prodSizes.priceMin, msg.minValue)
      .atMaxValue('price', prod.price, prodSizes.priceMax, msg.maxValue)
      .atLeastValue('cost', prod.cost, prodSizes.costMin, msg.minValue)
      .atMaxValue('cost', prod.cost, prodSizes.costMax, msg.maxValue)
      .atLeastValue('percentOff', prod.percentOff, prodSizes.percentOffMin, msg.minValue)
      .atMaxValue('percentOff', prod.percentOff, prodSizes.percentOffMax, msg.maxValue)

      .atLeastValue('height', prod.height, prodSizes.heightMin, msg.minValue)
      .atMaxValue('height', prod.height, prodSizes.heightMax, msg.maxValue)
      .atLeastValue('length', prod.length, prodSizes.lengthMin, msg.minValue)
      .atMaxValue('length', prod.length, prodSizes.lengthMax, msg.maxValue)
      .atLeastValue('width', prod.width, prodSizes.widthMin, msg.minValue)
      .atMaxValue('width', prod.width, prodSizes.widthMax, msg.maxValue)
      .atLeastValue('weight', prod.weight, prodSizes.weightMin, msg.minValue)
      .atMaxValue('weight', prod.weight, prodSizes.weightMax, msg.maxValue)

      .atLeastValue('amountAvailable', prod.amountAvailable, prodSizes.amountAvailableMin, msg.minValue)
      .atMaxValue('amountAvailable', prod.amountAvailable, prodSizes.amountAvailableMax, msg.maxValue)
      .atMaxLenList('categoriesId', prod.categoriesId, prodSizes.categoriesIdMax, msg.maxLenList)
      .hasValue('freeDelivery', prod.freeDelivery)
      ;
}

export const productService = {
    validate
};
