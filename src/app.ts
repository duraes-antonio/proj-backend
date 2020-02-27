'use strict';
// @ts-ignore
import express from 'express';
// @ts-ignore
import cors from 'cors';
// @ts-ignore
import mongoose from 'mongoose';
import routes from './routes';

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
		  `mongodb+srv://teste:teste@yugishop-ywmam.mongodb.net/test?retryWrites=true&w=majority`,
		  { useNewUrlParser: true }
		);
	}

	private routes(): void {
		this.express.use(routes);
	}
}

export default new App().express;
