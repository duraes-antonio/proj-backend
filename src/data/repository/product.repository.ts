'use strict';
import { Product } from '../schemas/product.schema';
import { IProduct } from '../../domain/interfaces/product.interface';
import { FilterProduct } from '../../domain/models/filters/filterProduct.model';

function parseQuery(filter: FilterProduct): any {
    const match: any = {};

    if (filter.text && filter.text.trim()) {
        match['$text'] = {
            $search: filter.text,
            $caseSensitive: false
        };
    }

    if (filter.avgReview && filter.avgReview.length) {
        match.avgReview = { avgInt: { $in: filter.avgReview } };
    }

    if (filter.dateStart) {
        match.createdAt = match.createdAt ? match.createdAt : {};
        match.createdAt['$gte'] = filter.dateStart;
    }

    if (filter.dateEnd) {
        match.createdAt = match.createdAt ? match.createdAt : {};
        match.createdAt['$lt'] = filter.dateEnd;
    }

    return match;
}

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
    const match = parseQuery(filter);
    const res = await Product
      .aggregate()
      .project({
          ...fieldsSelect,
          id: '$_id',
          avgInt: { $floor: '$avgReview' }
      })
      .match(match);
    /*.select(fieldsSelect)
    .sort({ score: { $meta: 'textScore' } })
    .skip(+filter.perPage * (+filter.currentPage - 1))
    .limit(+filter.perPage)
    .lean();
    */
    console.log(res);
    return res.map(obj => {
        return { ...obj, id: obj._id };
    });
}

async function findCount(filter: FilterProduct): Promise<number> {
    return await Product.count(parseQuery(filter));
}

export const productRepository = {
    findCount: findCount,
    find: find
};
