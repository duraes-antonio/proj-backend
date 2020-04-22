'use strict';
import { Document, model, Model } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { List } from '../../../domain/models/lists-item/list';
import { Product } from '../../../domain/models/product';
import { buildListSchema } from '../../builder-list-schema';

const productListSchema = buildListSchema(ECollectionsName.PRODUCT);

export const ListProductSchema: Model<ListProductDBModel> = model<ListProductDBModel>(ECollectionsName.LIST_PRODUCT, productListSchema);

export interface ListProductDBModel extends Document, List<Product> {
}
