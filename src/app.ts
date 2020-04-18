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
import { listLinksRoutes } from './routes/list-links.route';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose');

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
        this.express.use(indexRoutes);
        this.express.use('/address', addressRoutes);
        this.express.use('/auth', authRoutes);
        this.express.use('/category', categoryRoutes);
        this.express.use('/list-link', listLinksRoutes);
        this.express.use('/payment', paymentRoutes);
        this.express.use('/product', productRoutes);
        this.express.use('/review', reviewRoutes);
        this.express.use('/user', userRoutes);
    }
}

export default new App().express;
