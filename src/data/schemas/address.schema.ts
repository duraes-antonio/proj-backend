'use strict';
import { model, Model, Schema } from 'mongoose';
import { addressSizes } from '../../shared/fieldSize';
import { IAddress } from '../../domain/interfaces/address.interface';

const addressSchema = new Schema({
	city: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.cityMax
	},
	neighborhood: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.neighborhoodMax
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
		maxlength: addressSizes.stateMax
	},
	street: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.streetMax
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	zipCode: {
		type: String,
		required: true,
		trim: true,
		maxlength: addressSizes.zipCodeMax
	},
	createDate: {
		type: Date,
		required: true,
		default: Date.now
	}
});

export const Address: Model<IAddress> = model<IAddress>('Address', addressSchema);
