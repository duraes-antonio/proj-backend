import { PipelineValidation } from '../../shared/validations';
import { validationErrorMsg as msg } from '../../shared/buildMsg';
import { Slide, SlideBase, SlidePatch } from '../../domain/models/lists-item/slide';
import { slideSizes } from '../../shared/consts/fieldSize';
import { utilThrowError } from '../../shared/util-throw-error';
import { slideRepository } from '../../data/repository/slide.repository';
import { fileUploadService } from '../file-upload.service';
import * as fs from 'fs';

function _validate(data: SlideBase | SlidePatch, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastValue('Index', data.index, slideSizes.indexMin, msg.minValue)
      .atMaxValue('Index', data.index, slideSizes.indexMax, msg.maxValue)
      .atLeastLen('Title', data.title, slideSizes.titleMin, msg.minLen)
      .atMaxLen('Title', data.title, slideSizes.titleMax, msg.maxLen)
      .atLeastLen('Url', data.url, slideSizes.urlMin, msg.minLen)
      .atMaxLen('Url', data.url, slideSizes.urlMax, msg.maxLen);
}

const _validatePatch = (patch: SlidePatch): PipelineValidation =>
  _validate(patch, true);

const entityName = 'Slide';

const _create = async (
  slideAdd: SlideBase, fnValidate: (slide: SlideBase) => PipelineValidation
): Promise<Slide> => {
    const { index, title, url } = slideAdd;
    utilThrowError.checkAndThrowBadResquest(slideAdd, fnValidate);
    return slideRepository.create({ index, title, url });
};

const _delete = async (id: string): Promise<void> => {
    utilThrowError.checkAndThrowInvalidId(id);
    await slideRepository.delete(id);
};

const _deleteMany = async (ids: string[]): Promise<void> => {
    ids.forEach(id => utilThrowError.checkAndThrowInvalidId(id));
    await slideRepository.deleteMany(ids);
};

const _update = async (
  id: string, slidePatch: SlidePatch, fnValidate: (patch: SlidePatch) => PipelineValidation
): Promise<Slide | null> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const { index, title, url } = slidePatch;
    utilThrowError.checkAndThrowBadResquest(slidePatch, fnValidate);
    const objectUpdated = await slideRepository.update(
      id, { index, title, url }
    );
    utilThrowError.checkAndThrowNotFoundId(objectUpdated, id, entityName);
    return objectUpdated;
};

const _updateImage = async (
  id: string, newImage: Express.Multer.File, fnUpload: (img: Express.Multer.File) => Promise<string>
): Promise<Slide | null> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const imageUrl = await fnUpload(newImage);
    const objectUpdated = await slideRepository.update(id, { imageUrl });
    await fs.unlink(newImage.path, () => null);
    utilThrowError.checkAndThrowNotFoundId(objectUpdated, id, entityName);
    return objectUpdated;
};


export const slideService = {
    validate: _validate,
    delete: _delete,
    deleteMany: _deleteMany,
    create: (listAdd: SlideBase): Promise<Slide> => _create(listAdd, _validate),
    update: (id: string, patch: SlidePatch): Promise<Slide | null> =>
      _update(id, patch, _validatePatch),
    updateImage: (id: string, image: Express.Multer.File): Promise<Slide | null> =>
      _updateImage(id, image, fileUploadService.uploadImage)
};
