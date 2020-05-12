import { utilService as utilS } from './util';
import { BadRequestError, InvalidIdError } from '../domain/helpers/error';
import { PipelineValidation } from './validations';

const _throwInvalidId = (id: string, fnCheckId: (id: string) => boolean): void => {
    if (!fnCheckId(id)) {
        throw new InvalidIdError(id);
    }
};

const _throwBadRequest = <T>(patchObject: T, fnCheck: (patch: T) => PipelineValidation): void => {
    const pipeline = fnCheck(patchObject);
    if (!pipeline.valid) {
        throw new BadRequestError(pipeline.errors);
    }
};

export const utilThrowError = {
    checkAndThrowBadResquest: _throwBadRequest,
    checkAndThrowInvalidId: (id: string): void => _throwInvalidId(id, utilS.validIdHexadecimal)
};
