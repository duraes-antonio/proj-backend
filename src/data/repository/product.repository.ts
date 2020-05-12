'use strict';
import { Product } from '../../domain/models/product';
import { EProductSort } from '../../domain/enum/product-sort';
import { ObjectId } from 'bson';
import { ProductSchema } from '../schemas/product.schema';
import { utilService } from '../../shared/util';
import { FilterBasic } from '../../domain/models/filters/filter-basic';
import { FilterProduct } from '../../domain/models/filters/filter-product';
import { CategorySchema } from '../schemas/category.schema';
import { Category } from '../../domain/models/category';
import { repositoryFunctions } from '../repository.functions';
import { productService } from '../../services/product.service';

interface MatchQuery {
    categoriesId?: any;
    freeDelivery?: boolean;
    $and?: any[];
    $text?: any;
}

export interface FilterForSearch extends FilterBasic {
    avgReview: number[];
    categories: Category[];
    categoriesId: string[];
    discounts: number[][];
    freeDelivery: boolean;
    priceMax: number;
    priceMin: number;
    text?: string;
    sortBy?: EProductSort;
    result: Product[];
}

export interface ProductResume {
    avgInt: number;
    categoriesId: string[];
    percentOff: number;
    freeDelivery: boolean;
    priceWithDiscount: number;
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
        match.freeDelivery = filter.freeDelivery.toString().toLowerCase() === 'true';
    }

    if (filter.priceMin) {
        match.$and = [{ priceWithDiscount: { $gte: +filter.priceMin } }];
    }

    if (filter.priceMax) {
        match.$and = match.$and
          ? [...match.$and, { priceWithDiscount: { $lte: +filter.priceMax } }]
          : [{ priceWithDiscount: { $lte: +filter.priceMax } }];
    }

    if (filter.categoriesId && filter.categoriesId.length) {
        const idsCopy = filter.categoriesId instanceof Array ? [...filter.categoriesId] : [filter.categoriesId];
        const categIds = idsCopy.map(id => new ObjectId(id));
        match.$and = match.$and
          ? [...match.$and, { categoriesId: { $in: categIds } }]
          : [{ categoriesId: { $in: categIds } }];
    }

    if (filter.ids && filter.ids.length) {
        const idsCopy = filter.ids instanceof Array ? [...filter.ids] : [filter.ids];
        const ids = idsCopy.map(id => new ObjectId(id));
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
        const discounts: (number | string)[][] = filter.discounts[0] instanceof Array
          ? filter.discounts
          : utilService.chunckArray(filter.discounts as any[], 2);
        projectField.discountOk = {
            $or: discounts.map(pair => {
                return {
                    $and: [
                        { $gte: ['$percentOff', +pair[0]] },
                        { $lte: ['$percentOff', +pair[1]] }
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
      .skip((+filter.perPage ?? 1) * Math.max((+filter.currentPage ?? 1) - 1, 0));
    const results: Product[] = await (+(filter?.perPage) ? queryBeforeLimit.limit(+filter.perPage) : queryBeforeLimit);
    return results.map(p => {
        return { ...p, priceWithDiscount: productService.calculateRealPrice(p.price, p.percentOff) };
    });
}

async function findCount(filter: FilterProduct): Promise<number> {
    const match = buildMatchQuery(filter);

    const projectField: any = {
        avgInt: { $floor: '$avgReview' },
        ...buildProjection(filter)
    };

    const res = await ProductSchema
      .aggregate()
      .match(match)
      .project(projectField)
      .match(buildMatchQueryPostProjection(filter));
    return res.length;
}

// TODO: Refatorar e tipar querys
async function findFilterData(filter: FilterProduct): Promise<FilterForSearch> {
    const match = buildMatchQuery(filter);
    const projectField: object = {
        ...buildProjection(filter),
        categoriesId: 1,
        percentOff: 1,
        freeDelivery: 1,
        priceWithDiscount: 1
    };
    const queryRaw = ProductSchema
      .aggregate()
      .match(match)
      .project(projectField);
    const matchPostProjection = buildMatchQueryPostProjection(filter);
    const productsResume: ProductResume[] = await queryRaw.match(matchPostProjection);
    const categoriesId = Array.from(new Set(productsResume.map(p => p.categoriesId).flat()));
    const categories = (await CategorySchema
        .find({ _id: { $in: categoriesId } })
    ).map((objectDoc: any) => repositoryFunctions.insertFieldId(objectDoc._doc));
    const productsComplete = await find(filter);
    const filterFilled: FilterForSearch = {
        avgReview: [0, 1, 2, 3, 4, 5]
          .filter(rating => productsResume.some(p => p.avgInt === rating)),
        categories,
        categoriesId: categoriesId,
        currentPage: filter.currentPage,
        discounts: [[1, 10], [11, 25], [26, 40], [41, 60], [61, 80], [81, 99]]
          .filter(desc =>
            productsResume.some(p =>
              p.percentOff >= desc[0] && p.percentOff <= desc[1]
            )
          ),
        freeDelivery: productsResume.some(p => p.freeDelivery),
        perPage: filter.perPage,
        priceMin: Math.min(...productsResume.map(p => p.priceWithDiscount)),
        priceMax: Math.max(...productsResume.map(p => p.priceWithDiscount)),
        result: productsComplete,
        text: filter.text
    };
    return filterFilled;

}

export const productRepository = {
    find,
    findCount,
    findFilterData
};
