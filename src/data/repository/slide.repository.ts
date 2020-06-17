'use strict';
import { repositoryFunctions as repoFns } from '../repository.functions';
import { Slide, SlideBase, SlidePatch } from '../../domain/models/lists-item/slide';
import { SlideSchema } from '../schemas/list-items/slide.schema';

const _delete = async (slideId: string): Promise<Slide | null> =>
  repoFns.delete(slideId, SlideSchema);

const _deleteMany = async (slideIds: string[]): Promise<object> =>
  repoFns.deleteMany(slideIds, SlideSchema);

const _find = async (): Promise<Slide[]> =>
  repoFns.find<Slide>(SlideSchema);

const _create = async (slideAdd: SlideBase): Promise<Slide> =>
  repoFns.create(slideAdd, SlideSchema) as Promise<Slide>;

const _update = async (
  id: string, slidePatch: SlidePatch & { imageUrl?: string }
): Promise<Slide | null> =>
  repoFns.findAndUpdate(id, slidePatch, SlideSchema);

export const slideRepository = {
    create: _create,
    delete: _delete,
    deleteMany: _deleteMany,
    find: _find,
    update: _update
};
