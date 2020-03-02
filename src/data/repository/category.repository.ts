'use strict';
import { IRepository } from '../repository.interface';
import { Category } from '../schemas/category.schema';
import { ICategory } from '../../domain/interfaces/category.interface';

const projection = 'title updatedAt createdAt';

export class CategoryRepository implements IRepository<ICategory> {

    async create(obj: ICategory): Promise<ICategory> {
        return await new Category(obj).save({});
    }

    async delete(id: string): Promise<ICategory | null> {
        return await Category.findByIdAndDelete(id);
    }

    async find(): Promise<ICategory[]> {
        return await Category.find({}, projection);
    }

    async findById(id: string): Promise<ICategory | null> {
        return await Category.findById(id, projection);
    }

    async update(id: string, obj: ICategory): Promise<ICategory | null> {
        return await Category.findByIdAndUpdate(
          id,
          { $set: { title: obj.title } }
        );
    }
}
