'use strict';
import { repositoryFunctions as repoFns } from '../repository.functions';
import { Slide, SlideBase } from '../../domain/models/lists-item/slide';
import { List, ListAdd, ListPatch } from '../../domain/models/lists-item/list';
import { ListSlideSchema } from '../schemas/list-items/slide-list.schema';

const _delete = async (listId: string): Promise<List<Slide> | null> =>
  repoFns.delete(listId, ListSlideSchema);

const _find = async (): Promise<List<Slide>[]> =>
  repoFns.find<List<Slide>>(
    ListSlideSchema, undefined, undefined, undefined, 'items'
  );

const _findById = async (listId: string): Promise<List<Slide> | null> =>
  repoFns.findById(listId, ListSlideSchema);

const _create = async (listAdd: ListAdd<SlideBase>): Promise<List<Slide>> =>
  repoFns.create(listAdd, ListSlideSchema) as Promise<List<Slide>>;

const _update = async (id: string, listPatch: ListPatch): Promise<List<Slide> | null> =>
  repoFns.findAndUpdate(id, listPatch, ListSlideSchema);

export const listSlideRepository = {
    create: _create,
    delete: _delete,
    find: _find,
    findById: _findById,
    update: _update
};
