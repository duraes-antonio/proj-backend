'use strict';
import { Product } from '../schemas/product.schema';
import { IProduct } from '../../domain/interfaces/product.interface';
import { IRepository } from '../repository.interface';

const projection = 'amountAvailable avgReview categories desc freeDelivery percentOff price priceWithDiscount title urlMainImage';

export class ProductRepository implements IRepository<IProduct> {

    async delete(id: string): Promise<IProduct | null> {
        return await Product.findByIdAndDelete(id);
    }

    async find(): Promise<IProduct[]> {
        return await Product.find({}, projection).populate(['categoriesId']);
    }

    async findById(id: string): Promise<IProduct | null> {
        return await Product.findById(id, projection);
    }

    async create(prod: IProduct): Promise<IProduct> {
        return await new Product(prod).save();
    }

    async update(id: string, prod: IProduct): Promise<IProduct | null> {
        return await Product.findByIdAndUpdate(
          id,
          {
              $set: {
                  amountAvailable: prod.amountAvailable,
                  avgReview: prod.avgReview,
                  categoriesId: prod.categoriesId,
                  desc: prod.desc,
                  freeDelivery: prod.freeDelivery,
                  percentOff: prod.percentOff,
                  price: prod.price,
                  title: prod.title,
                  urlMainImage: prod.urlMainImage
              }
          }
        );
    }
}
