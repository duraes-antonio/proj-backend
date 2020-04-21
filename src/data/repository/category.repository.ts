'use strict';
import { Category } from '../../domain/models/category';
import { FilterCategory } from '../../domain/models/filters/filter-category';
import { CategorySchema } from '../schemas/category.schema';

interface CategoryQuery {
    $text?: {
        $search: string;
        $caseSensitive: boolean;
    };
    createdAt?: {
        $gte?: Date;
        $lt?: Date;
    };
}

function parseQuery(filter: FilterCategory): CategoryQuery {
    const query: CategoryQuery = {};

    if (filter.text && filter.text.trim()) {
        query.$text = {
            $search: filter.text,
            $caseSensitive: false
        };
    }

    if (filter.dateStart) {
        query.createdAt = query.createdAt ? query.createdAt : {};
        query.createdAt.$gte = filter.dateStart;
    }

    if (filter.dateEnd) {
        query.createdAt = query.createdAt ? query.createdAt : {};
        query.createdAt.$lt = filter.dateEnd;
    }

    return query;
}

async function find(filter: FilterCategory): Promise<Category[]> {
    const queryResult = await CategorySchema.find(
      parseQuery(filter),
      { 'score': { '$meta': 'textScore' } }
    ).select({ id: 1, title: 1, createdAt: 1 })
      .sort({ score: { $meta: 'textScore' } })
      .skip(+filter.perPage * (+filter.currentPage - 1))
      .limit(+filter.perPage)
      .lean();
    return queryResult.map(obj => {
        return { ...obj, id: obj._id };
    });
}

async function findCount(filter: FilterCategory): Promise<number> {
    const queryResult = await CategorySchema.find(
      parseQuery(filter),
      { 'score': { '$meta': 'textScore' } }
    ).lean();
    return queryResult.length;
}

export const categoryRepository = {
    findCount,
    find
};
