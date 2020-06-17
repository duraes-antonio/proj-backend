import { utilService as utilS } from './util';
import { BadRequestError, InvalidIdError, NotFoundError } from '../domain/helpers/error';
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

const _throwNotFoundId = (obj: any, id: string, entityName: string): void => {
    if (!obj) {
        throw new NotFoundError(entityName, 'id', id);
    }
};

export const utilThrowError = {
    checkAndThrowBadResquest: _throwBadRequest,
    checkAndThrowInvalidId: (id: string): void => _throwInvalidId(id, utilS.validIdHexadecimal),
    checkAndThrowNotFoundId: _throwNotFoundId
};
