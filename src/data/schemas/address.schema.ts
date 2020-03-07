'use strict';
import { model, Model, Schema } from 'mongoose';
import { addressSizes } from '../../shared/fieldSize';
import { IAddressSchema } from '../../domain/interfaces/address.interface';
import { ECollectionsName } from '../collectionsName.enum';

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
        ref: ECollectionsName.USER,
        required: true
    },
    zipCode: {
        type: String,
        required: true,
        trim: true,
        maxlength: addressSizes.zipCodeMax
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

export const Address: Model<IAddressSchema> = model<IAddressSchema>(ECollectionsName.ADDRESS, addressSchema);
