'use strict';
import { Product } from '../schemas/product.schema';
import { IProduct, IProductSchema } from '../../domain/interfaces/product.interface';

const projection = 'amountAvailable avgReview categories desc freeDelivery percentOff price priceWithDiscount title urlMainImage';

async function delete_(id: string): Promise<IProductSchema> {
    return await Product.findByIdAndDelete(id);
}

async function find(): Promise<IProductSchema[]> {
    return await Product.find({}, projection).populate(['categories']);
}

async function findById(id: string): Promise<IProductSchema> {
    return await Product.findById(id, projection);
}

async function create(prod: IProduct): Promise<IProductSchema> {
    return await new Product(prod).save();
}

async function update(id: string, prod: IProduct): Promise<IProductSchema> {
    return await Product.findByIdAndUpdate(
      id,
      {
          $set: {
              amountAvailable: prod.amountAvailable,
              avgReview: prod.avgReview,
              categories: prod.categories,
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

export const productRepository = {
    delete: delete_,
    find: find,
    findBydId: findById,
    create: create,
    put: update
};
