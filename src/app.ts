'use strict';
import { Mongoose } from 'mongoose';
import { indexRoutes } from './routes/index.route';
import { config } from './config';
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';
import { categoryRoutes } from './routes/category.route';
import { productRoutes } from './routes/product.route';
import { reviewRoutes } from './routes/review.route';
import { paymentRoutes } from './routes/payment.route';
import { addressRoutes } from './routes/address.route';
import { listLinksRoutes } from './routes/list-items/link-list.route';
import { listProductsRoutes } from './routes/list-items/product-list.route';
import { linkRoutes } from './routes/list-items/link.route';
import { marketRoutes } from './routes/list-items/market.route';
import { listMarketsRoutes } from './routes/list-items/market-list.route';
import { listSlidesRoutes } from './routes/list-items/slide-list.route';
import { slideRoutes } from './routes/list-items/slide.route';
import { shippingRoutes } from './routes/shipping.route';
import { orderRoutes } from './routes/order.route';

/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');

export class App {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    express: express.Application;
    databaseInstance: Promise<Mongoose>;

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
        this.databaseInstance = this.database(config.connectionString);
    }

    private database(connectionString: string): Promise<Mongoose> {
        return mongoose.connect(
          connectionString,
          {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
              useFindAndModify: false
          }
        );
    }

    private middlewares(): void {
        this.express.use(cors());
        this.express.use(express.json());
    }

    private routes(): void {
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(multer().array());
        this.express.use(indexRoutes);
        this.express.use('/address', addressRoutes);
        this.express.use('/auth', authRoutes);
        this.express.use('/category', categoryRoutes);
        this.express.use('/link', linkRoutes);
        this.express.use('/list-link', listLinksRoutes);
        this.express.use('/list-market', listMarketsRoutes);
        this.express.use('/list-product', listProductsRoutes);
        this.express.use('/list-slide', listSlidesRoutes);
        this.express.use('/market', marketRoutes);
        this.express.use('/order', orderRoutes);
        this.express.use('/payment', paymentRoutes);
        this.express.use('/product', productRoutes);
        this.express.use('/review', reviewRoutes);
        this.express.use('/shipping', shippingRoutes);
        this.express.use('/slide', slideRoutes);
        this.express.use('/user', userRoutes);
    }
}

export default new App().express;
