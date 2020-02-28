'use strict';
// @ts-ignore
import express from 'express';
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import mongoose from 'mongoose';
import { indexRoutes } from './routes/index.route';
import { addressRoutes } from './routes/address.route';
import { config } from './config';
import { userRoutes } from './routes/user.route';

class App {
	express: express.Application;

	constructor() {
		this.express = express();
		this.middlewares();
		this.database();
		this.routes();
	}

	private middlewares(): void {
		this.express.use(express.json());
		this.express.use(cors());
	}

	private database(): void {
		mongoose.connect(
		  config.connectionString,
		  { useNewUrlParser: true }
		);
	}

	private routes(): void {
		this.express.use(indexRoutes);
		this.express.use('/address', addressRoutes);
		this.express.use('/user', userRoutes);
	}
}

export default new App().express;
