'use strict';
// @ts-ignore
import express from 'express';
import { Mongoose } from 'mongoose';
import { indexRoutes } from './routes/index.route';
import { config } from './config';
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';
import { categoryRoutes } from './routes/category.route';
import { productRoutes } from './routes/product.route';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv')
  .config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export class App {
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
        this.express.use(express.json());
        this.express.use(cors());
    }

    private routes(): void {
        this.express.use(indexRoutes);
        // this.express.use('/address', addressRoutes);
        this.express.use('/auth', authRoutes);
        this.express.use('/category', categoryRoutes);
        this.express.use('/product', productRoutes);
        this.express.use('/user', userRoutes);
    }
}

export default new App().express;
