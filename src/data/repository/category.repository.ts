'use strict';
import { Category } from '../schemas/category.schema';
import { ICategory } from '../../domain/interfaces/category.interface';
import { FilterCategory } from '../../domain/models/filters/filterCategory.model';

const select = 'title createdAt';

async function find(filter: FilterCategory): Promise<ICategory[]> {
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
    return await Category.find(
      query,
      { 'score': { '$meta': 'textScore' } }
    ).select({ id: 1, title: 1, createdAt: 1 })
      .sort({ score: { $meta: 'textScore' } })
      .lean();
}

async function findCount(filter: FilterCategory): Promise<number> {
    return await Category.count({
        $text: { $search: filter.text, $caseSensitive: false },
        score: { $meta: 'textScore' },
        id: {
            $in: filter.categoriesId
        },
        createdAt: {
            $gte: filter.dateStart,
            $lt: filter.dateEnd
        }
    });
}

export const categoryRepository = {
    findCount: findCount,
    find: find
};
