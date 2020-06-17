import { List, ListAdd, ListPatch } from '../../domain/models/lists-item/list';
import { PipelineValidation } from '../../shared/validations';
import { validationErrorMsg as msg } from '../../shared/buildMsg';
import { listSizes } from '../../shared/consts/fieldSize';
import { Slide, SlideBase } from '../../domain/models/lists-item/slide';
import { listSlideRepository } from '../../data/repository/list-slide.repository';
import { utilThrowError } from '../../shared/util-throw-error';

function validateListAdd<T>(list: ListAdd<T>, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .hasValue('ReadRole', list.readRole)
      .atMaxLenList('ItemsId', list.itemsId, listSizes.itemsIdMax, msg.maxLenList)
      .atLeastLen('Title', list.title, listSizes.titleMin, msg.minLen)
      .atMaxLen('Title', list.title, listSizes.titleMax, msg.maxLen);
}

const validateListPatch = (list: ListPatch): PipelineValidation => {
    return new PipelineValidation(msg.empty, true)
      .atMaxLenList('ItemsId', list.itemsId, listSizes.itemsIdMax, msg.maxLenList)
      .atLeastLen('Title', list.title, listSizes.titleMin, msg.minLen)
      .atMaxLen('Title', list.title, listSizes.titleMax, msg.maxLen);
};

const entityName = 'Lista de Slides';

const _create = async (
  listAdd: ListAdd<SlideBase>, fnCreateSlide: (slide: SlideBase) => Promise<Slide>,
  fnValidate: (list: ListAdd<SlideBase>) => PipelineValidation
): Promise<List<Slide>> => {
    const { title, itemsId, readRole } = listAdd;
    utilThrowError.checkAndThrowBadResquest(listAdd, fnValidate);
    const slide = await fnCreateSlide({
        index: 0,
        title: '1º Slide',
        url: 'www.google.com'
    });
    return listSlideRepository.create({ title, itemsId: [slide.id], readRole });
};

const _delete = async (
  id: string, fnFindById: (listId: string) => Promise<List<Slide>>,
  fnDeleteItems: (ids: string[]) => void
): Promise<void> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const list = await fnFindById(id);
    await fnDeleteItems(list.itemsId);
    await listSlideRepository.delete(id);
};

const _find = async (): Promise<List<Slide>[]> =>
  listSlideRepository.find();

const _findById = async (id: string): Promise<List<Slide>> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const list = await listSlideRepository.findById(id);
    utilThrowError.checkAndThrowNotFoundId(list, id, entityName);
    return list as List<Slide>;
};

const _update = async (
  id: string, listPatch: ListPatch, fnValidate: (list: ListPatch) => PipelineValidation
): Promise<List<Slide> | null> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const { title, readRole, itemsId } = listPatch;
    utilThrowError.checkAndThrowBadResquest(listPatch, fnValidate);
    const objectUpdated = await listSlideRepository.update(
      id, { title, readRole, itemsId }
    );
    utilThrowError.checkAndThrowNotFoundId(objectUpdated, id, entityName);
    return objectUpdated;
};


export const listSlideService = {
    validateListAdd: validateListAdd,
    delete: (id: string, fnRemoveItems: (ids: string[]) => Promise<void>): Promise<void> =>
      _delete(id, _findById, fnRemoveItems),
    find: _find,
    findById: _findById,
    create: (listAdd: ListAdd<SlideBase>, createSlide: (s: SlideBase) => Promise<Slide>): Promise<List<Slide>> =>
      _create(listAdd, createSlide, validateListAdd),
    update: (id: string, patch: ListPatch): Promise<List<Slide> | null> =>
      _update(id, patch, validateListPatch)
};
