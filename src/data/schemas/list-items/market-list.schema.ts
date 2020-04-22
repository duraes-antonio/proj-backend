'use strict';
import { Document, model, Model } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { buildListSchema } from '../../builder-list-schema';
import { List } from '../../../domain/models/lists-item/list';
import { Market } from '../../../domain/models/lists-item/market';

const listMarketSchema = buildListSchema(ECollectionsName.MARKET);

export const ListMarketSchema: Model<ListMarketDBModel> = model<ListMarketDBModel>(ECollectionsName.LIST_MARKET, listMarketSchema);

export interface ListMarketDBModel extends Document, List<Market> {
}
