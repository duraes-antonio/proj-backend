'use strict';

import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { addressSizes } from '../shared/fieldSize';

const addressSchema = new Schema({
	city: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.cityMaxLen
	},
	neighborhood: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.neighborhoodMaxLen
	},
	number: {
		type: Number,
		required: true,
		max: addressSizes.numberMax
	},
	state: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.stateMaxLen
	},
	street: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.streetMaxLen
	},
	zipCode: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.zipCodeMaxLen
	}
});

module.exports = mongoose.model('Address', addressSchema);
