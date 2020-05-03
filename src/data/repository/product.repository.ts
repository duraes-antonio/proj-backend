'use strict';
import { Product } from '../../domain/models/product';
import { FilterProduct } from '../../domain/models/filters/filter-product';
import { EProductSort } from '../../domain/enum/product-sort';
import { ObjectId } from 'bson';
import { ProductSchema } from '../schemas/product.schema';

interface MatchQuery {
    categoriesId?: any;
    freeDelivery?: boolean;
    $and?: any[];
    $text?: any;
}

const productFieldsProjection = {
    avgReview: 1,
    priceWithDiscount: 1,
    visible: 1,
    quantity: 1,
    categoriesId: 1,
    desc: 1,
    freeDelivery: 1,
    percentOff: 1,
    price: 1,
    title: 1,
    urlMainImage: 1,
    cost: 1,
    height: 1,
    width: 1,
    length: 1,
    weight: 1
};

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

    if (filter.ids && filter.ids.length) {
        const ids = filter.ids.map(id => new ObjectId(id));
        match.$and = match.$and
          ? [...match.$and, { _id: { $in: ids } }]
          : [{ _id: { $in: ids } }];
    }

    if (filter.text && filter.text.trim()) {
        match['$text'] = {
            $search: filter.text,
            $caseSensitive: false
        };
    }

    return match;
}

function buildMatchQueryPostProjection(filter: FilterProduct): any {
    const match: any = {};

    if (filter?.avgReview?.length) {
        match.avgInt = { $in: filter.avgReview };
    }

    if (filter?.discounts?.length) {
        match.discountOk = true;
    }

    return match;
}

function buildProjection(filter: FilterProduct): any {

    const projectField: any = {
        avgInt: { $floor: '$avgReview' }
    };

    if (filter.discounts && filter.discounts.length) {
        projectField.discountOk = {
            $or: filter.discounts.map(pair => {
                return {
                    $and: [
                        { $gte: ['$percentOff', pair[0]] },
                        { $lte: ['$percentOff', pair[1]] }
                    ]
                };
            })
        };
    }

    return projectField;
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


async function find(filter: FilterProduct): Promise<Product[]> {
    const match = buildMatchQuery(filter);
    let sortBy = sortOptions.get(EProductSort.NEWEST);

    if (filter.sortBy && (+filter.sortBy !== EProductSort.DEFAULT || filter.text)) {
        sortBy = sortOptions.get(+filter.sortBy);
    }

    const projectField: any = {
        avgInt: { $floor: '$avgReview' },
        id: '$_id',
        _id: false,
        ...buildProjection(filter),
        ...productFieldsProjection
    };
    const queryRaw = ProductSchema
      .aggregate()
      .match(match)
      .project(projectField);

    const matchPostProjection = buildMatchQueryPostProjection(filter);
    const queryBeforeLimit = queryRaw
      .match(matchPostProjection)
      .sort(sortBy)
      .skip((filter.perPage ?? 1) * Math.max((filter.currentPage ?? 1) - 1, 0));
    const results: Product[] = await (filter?.perPage ? queryBeforeLimit.limit(+filter.perPage) : queryBeforeLimit);
    return results.map(p => {
        return { ...p, priceWithDiscount: p.price * (1 - p.percentOff / 100) };
    });
}

async function findCount(filter: FilterProduct): Promise<number> {
    const match = buildMatchQuery(filter);

    const projectField: any = {
        avgInt: { $floor: '$avgReview' },
        ...buildProjection(filter)
    };

    const queryRaw = ProductSchema
      .aggregate()
      .match(match)
      .project(projectField)
      .match(buildMatchQueryPostProjection(filter));
    return (await queryRaw).length;
}

export const productRepository = {
    findCount,
    find
};
