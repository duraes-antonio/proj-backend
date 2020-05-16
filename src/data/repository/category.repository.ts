'use strict';
import { Category, CategoryFilterFilled } from '../../domain/models/category';
import { FilterCategory } from '../../domain/models/filters/filter-category';
import { CategorySchema } from '../schemas/category.schema';
import { ProductSchema } from '../schemas/product.schema';
import { ECategorySort } from '../../domain/enum/category-sort';
import { utilService } from '../../shared/util';

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

type ProductPreview = {
    categoriesId: string[];
    title: string;
    urlMainImage: string;
};

const categorySortOptions = new Map<ECategorySort, object>([
    [ECategorySort.OLDEST, { createdAt: 1 }],
    [ECategorySort.NAME, { title: 1 }],
    [ECategorySort.NEWEST, { createdAt: -1 }]
]);

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
    const sort = categorySortOptions.get(filter.sortBy);
    const queryResult = await CategorySchema.find(
      parseQuery(filter),
      { 'score': { '$meta': 'textScore' } }
    ).select({ id: 1, title: 1, createdAt: 1 })
      .sort((sort ?? { title: 1 }))
      .skip(+filter.perPage * (+filter.currentPage - 1))
      .limit(+filter.perPage)
      .lean();
    return queryResult.map(obj => {
        return {
            createdAt: obj.createdAt,
            title: obj.title,
            id: obj._id
        } as Category;
    });
}

async function findCount(filter: FilterCategory): Promise<number> {
    const queryResult = await CategorySchema.find(
      parseQuery(filter),
      { 'score': { '$meta': 'textScore' } }
    ).lean();
    return queryResult.length;
}

async function _findFilterData(filter?: FilterCategory): Promise<CategoryFilterFilled> {
    const newFilter = filter ?? ({ currentPage: 1, perPage: 1000, text: '' });
    const categoriesMatch = await find({
        currentPage: 1,
        dateStart: newFilter.dateStart,
        dateEnd: newFilter.dateEnd,
        text: newFilter.text,
        sortBy: newFilter.sortBy,
        perPage: 1000
    });
    /*    const categoriesForReturn = categoriesMatch.slice(
          (newFilter.currentPage - 1) * newFilter.perPage,
          (newFilter.currentPage) * newFilter.perPage
        );*/
    const mapCategoryIdProducts = new Map<string, [Category, ProductPreview[]]>(
      categoriesMatch.map(category => [category.id.toString(), [category, []]])
    );
    const products: ProductPreview[] = await ProductSchema
      .find(
        { categoriesId: { $in: categoriesMatch.map(c => c.id) } },
        {
            _id: 0,
            categoriesId: 1,
            title: 1,
            urlMainImage: 1
        })
      .lean();

    products.forEach(p =>
      p.categoriesId.forEach(cId => {
          const refListProdPreview = mapCategoryIdProducts.get(cId.toString());
          if (refListProdPreview) {
              refListProdPreview[1].push(p);
          }
      })
    );

    let categoriesForReturn: Category[];
    if (newFilter.sortBy === ECategorySort.PRODUCT_COUNT) {
        const entriesFromMap = Array.from(mapCategoryIdProducts);
        categoriesForReturn = utilService.orderDescending(
          entriesFromMap,
          (obj: [string, [Category, ProductPreview[]]]) => obj[1][1].length
        ).slice(
          (newFilter.currentPage - 1) * newFilter.perPage,
          (newFilter.currentPage) * newFilter.perPage
        ).map(pair => pair[1][0]);
    } else {
        categoriesForReturn = categoriesMatch.slice(
          (newFilter.currentPage - 1) * newFilter.perPage,
          (newFilter.currentPage) * newFilter.perPage
        );
    }

    return {
        ...newFilter,
        count: categoriesMatch.length,
        result: categoriesForReturn.map(category => {
            const idString = category.id.toString();
            return {
                ...category,
                productsQuantity: (mapCategoryIdProducts.get(idString) ?? [{}, []])[1].length,
                productPreview: (mapCategoryIdProducts.get(idString) ?? [{}, []])[1]
                  .slice(0, 3)
                  .map(p => {
                      return { title: p.title, urlImage: p.urlMainImage };
                  })
            };
        })
    };
}

export const categoryRepository = {
    find,
    findCount,
    findFilterData: _findFilterData
};
