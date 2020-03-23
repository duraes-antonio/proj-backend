'use strict';
import { Product } from '../schemas/product.schema';
import { IProduct } from '../../domain/interfaces/product.interface';
import { FilterProduct } from '../../domain/models/filters/filterProduct.model';
import { EProductSort } from '../../domain/enum/productSort.enum';
import { ObjectId } from 'bson';

class MatchQuery {
    categoriesId?: any;
    freeDelivery?: boolean;
    $and?: any[];
    $text?: any;
}

function buildMatchQuery(filter: FilterProduct): MatchQuery {
    const match: MatchQuery = {};

    if (!!filter.freeDelivery) {
        match.freeDelivery = filter.freeDelivery;
    }

    if (filter.priceMin) {
        match.$and = [{ price: { $gte: filter.priceMin } }];
    }

    if (filter.priceMax) {
        match.$and = match.$and
          ? [...match.$and, { price: { $lte: filter.priceMax } }]
          : [{ price: { $lte: filter.priceMax } }];
    }

    if (filter.categoriesId && filter.categoriesId.length) {
        const categIds = filter.categoriesId.map(id => new ObjectId(id));
        match.$and = match.$and
          ? [...match.$and, { categoriesId: { $in: categIds } }]
          : [{ categoriesId: { $in: categIds } }];
    }

    if (filter.text && filter.text.trim()) {
        match['$text'] = {
            $search: filter.text,
            $caseSensitive: false
        };
    }

    return match;
}

function buildSortParams(): Map<EProductSort, any> {
    const mapParam = new Map<EProductSort, any>();
    mapParam.set(EProductSort.AVERAGE_REVIEW, { 'avgReview': -1 });
    mapParam.set(EProductSort.DEFAULT, { score: { $meta: 'textScore' } });
    mapParam.set(EProductSort.DISCOUNTS, { 'percentOff': -1 });
    mapParam.set(EProductSort.OLDEST, { 'createdAt': 1 });
    mapParam.set(EProductSort.NEWEST, { 'createdAt': -1 });
    mapParam.set(EProductSort.PRICE_HIGH, { 'price': -1 });
    mapParam.set(EProductSort.PRICE_LOW, { 'price': 1 });
    return mapParam;
}

const sortOptions = buildSortParams();

const fieldsSelect = {
    avgReview: 1,
    amountAvailable: 1,
    categoriesId: 1,
    createdAt: 1,
    desc: 1,
    freeDelivery: 1,
    percentOff: 1,
    price: 1,
    title: 1,
    urlMainImage: 1
};

async function find(filter: FilterProduct): Promise<IProduct[]> {
    const match = buildMatchQuery(filter);

    let sortBy = sortOptions.get(EProductSort.NEWEST);

    if (filter.sortBy && (+filter.sortBy !== EProductSort.DEFAULT || filter.text)) {
        sortBy = sortOptions.get(+filter.sortBy);
    }

    const projectField = {
        ...fieldsSelect,
        avgInt: { $floor: '$avgReview' },
        id: '$_id',
        discountOk: {
            $or: filter.discounts.map(pair => {
                return {
                    $and: [
                        { $gte: ['$percentOff', pair[0]] },
                        { $lte: ['$percentOff', pair[1]] }
                    ]
                };
            })
        }
    };

    let queryRaw = Product
      .aggregate()
      .match(match)
      .project(projectField);

    const match2: any = {};

    if (filter.avgReview && filter.avgReview.length) {
        match2.avgInt = { $in: filter.avgReview };
    }

    if (filter.discounts && filter.discounts.length) {
        match2.discountOk = true;
    }

    return await queryRaw
      .match(match2)
      .sort(sortBy)
      .skip(+filter.perPage * (Math.max(+filter.currentPage, 1) - 1))
      .limit(+filter.perPage);
}

async function findCount(filter: FilterProduct): Promise<number> {
    return await Product.count(buildMatchQuery(filter));
}

export const productRepository = {
    findCount: findCount,
    find: find
};
