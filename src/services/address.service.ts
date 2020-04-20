import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { addressSizes as addrSize } from '../shared/fieldSize';
import { AddressAdd } from '../domain/models/address';

function validate(addr: AddressAdd, allowUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, allowUndefined)
      .atMaxLen('city', addr.city, addrSize.cityMax, msg.maxLen)
      .atLeastLen('city', addr.city, addrSize.cityMin, msg.minLen)
      .atLeastLen('neighborhood', addr.neighborhood, addrSize.neighborhoodMin, msg.minLen)
      .atMaxLen('neighborhood', addr.neighborhood, addrSize.neighborhoodMax, msg.maxLen)
      .atLeastValue('number', addr.number, addrSize.numberMin, msg.minValue)
      .atMaxValue('number', addr.number, addrSize.numberMax, msg.maxValue)
      .exactlytLen('state', addr.state, addrSize.stateMax, msg.exactlyLen)
      .atLeastLen('street', addr.street, addrSize.streetMin, msg.minLen)
      .atMaxLen('street', addr.street, addrSize.streetMax, msg.maxLen)
      .validCEP('zipCode', addr.zipCode, msg.invalidFormat);
}

export const addressService = {
    validate
};
