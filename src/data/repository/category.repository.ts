'use strict';
import { Category } from '../schemas/category.schema';
import { ICategory } from '../../domain/interfaces/category.interface';
import { FilterCategory } from '../../domain/models/filters/filterCategory.model';

function parseQuery(filter: FilterCategory): any {
    const query: any = {};

    if (filter.text && filter.text.trim()) {
        query['$text'] = {
            $search: filter.text,
            $caseSensitive: false
        };
    }

    if (filter.dateStart) {
        query.createdAt = query.createdAt ? query.createdAt : {};
        query.createdAt['$gte'] = filter.dateStart;
    }

    if (filter.dateEnd) {
        query.createdAt = query.createdAt ? query.createdAt : {};
        query.createdAt['$lt'] = filter.dateEnd;
    }

    return query;
}

async function find(filter: FilterCategory): Promise<ICategory[]> {
    const res = await Category.find(
      parseQuery(filter),
      { 'score': { '$meta': 'textScore' } }
    ).select({ id: 1, title: 1, createdAt: 1 })
      .sort({ score: { $meta: 'textScore' } })
      .skip(+filter.perPage * (+filter.currentPage - 1))
      .limit(+filter.perPage)
      .lean();
    return res.map(obj => {
        return { ...obj, id: obj._id };
    });
}

async function findCount(filter: FilterCategory): Promise<number> {
    return await Category.count(parseQuery(filter));
}

export const categoryRepository = {
    findCount: findCount,
    find: find
};
