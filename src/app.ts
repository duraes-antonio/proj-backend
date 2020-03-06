'use strict';
// @ts-ignore
import express from 'express';
import { indexRoutes } from './routes/index.route';
import { config } from './config';
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';
import { Model, Mongoose } from 'mongoose';
import { IClassAuditable } from './domain/interfaces/auditable.interface';
import { categoryRoutes } from './routes/category.route';

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
        const mongo = mongoose.connect(
          connectionString,
          {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
              useFindAndModify: false
          }
        );

        mongo.then((mg: Mongoose) =>
          this.checkSchemaImplementsAuditable(mg));

        return mongo;
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
        // this.express.use('/product', productRoutes);
        this.express.use('/user', userRoutes);
    }

    private checkSchemaImplementsAuditable(mg: Mongoose) {
        const props = Object.keys(new IClassAuditable());
        const schemasPendents: string[] = [];

        mg.modelNames().forEach(modelName => {
            const model: Model<any> = mg.models[modelName];
            const modelKeys = Object.keys(model.schema.obj);

            if (!props.every(p => modelKeys.indexOf(p) > -1)) {
                const ausents = props
                  .filter(p => modelKeys.indexOf(p) < 0)
                  .join(', ');
                schemasPendents.push(`Schema ${modelName} não implementa: ${ausents}`);
            }
        });

        if (schemasPendents.length) {
            const errorMsg = schemasPendents.join('\n');
            throw new Error(`É necessário que todos Schemas implementem a interface.\n\n${errorMsg}`);
        }
    }
}

export default new App().express;
