'use strict';
import { Document, model, Model } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { buildListSchema } from '../../builder-list-schema';
import { List } from '../../../domain/models/lists-item/list';
import { Slide } from '../../../domain/models/lists-item/slide';

const slideListSchema = buildListSchema(ECollectionsName.SLIDE);

export const ListSlideSchema: Model<ListSlideDBModel> = model<ListSlideDBModel>(ECollectionsName.LIST_SLIDE, slideListSchema);

export interface ListSlideDBModel extends Document, List<Slide> {
}
