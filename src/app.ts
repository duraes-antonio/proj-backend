'use strict';
// @ts-ignore
import express from 'express';
import { indexRoutes } from './routes/index.route';
import { addressRoutes } from './routes/address.route';
import { config } from './config';
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';
import { Mongoose } from 'mongoose';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

class App {
	express: express.Application;

	constructor() {
		this.express = express();
		this.middlewares();
		App.database(config.connectionString);
		this.routes();
	}

	private static database(connectionString: string): Promise<Mongoose> {
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
		this.express.use('/address', addressRoutes);
		this.express.use('/auth', authRoutes);
		this.express.use('/user', userRoutes);
	}
}

export default new App().express;
