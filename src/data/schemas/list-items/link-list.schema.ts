'use strict';
import { Document, model, Model } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { List } from '../../../domain/models/lists-item/list';
import { Link } from '../../../domain/models/lists-item/link';
import { buildListSchema } from '../../builder-list-schema';

const listLinkSchema = buildListSchema(ECollectionsName.LINK);

export const ListLinkSchema: Model<ListLinkDBModel> = model<ListLinkDBModel>(ECollectionsName.LIST_LINK, listLinkSchema);

export interface ListLinkDBModel extends Document, List<Link> {
}
