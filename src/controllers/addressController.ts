'use strict';

import e = require('express');
import * as mongoose from 'mongoose';

const Address = mongoose.model('Address');

exports.delete = (req: e.Request, res: e.Response, next: e.NextFunction) => {
	Address.deleteOne({
		id: req.params.id
	}).then(re => {
		res.status(200).send();
	}).catch(err => {
		res.status(400).send(err);
	});
};

exports.get = (req: e.Request, res: e.Response, next: e.NextFunction) => {
	Address.find()
	  .then(addr => {
		  res.status(200).send(addr);
	  })
	  .catch(err => {
		  res.status(400).send(err);
	  });
};

exports.getById = (req: e.Request, res: e.Response, next: e.NextFunction) => {
	Address.findOne({
		id: req.params.id
	}).then(addr => {
		res.status(200).send(addr);
	}).catch(err => {
		res.status(400).send(err);
	});
};

exports.post = (req: e.Request, res: e.Response, next: e.NextFunction) => {
	Address.findByIdAndUpdate(req.params.id, {
		$set: {}
	});
};

exports.put = (req: e.Request, res: e.Response, next: e.NextFunction) => {
	Address.find();
};
