'use strict';

export class Address {
	readonly id: number;
	readonly street: string;
	readonly number: number;
	readonly zipCode: string;
	readonly neighborhood: string;
	readonly city: string;
	readonly state: string;

	constructor(
	  number: number, zipcode: string, street: string, neigborhood: string,
	  city: string, state: string) {
		this.number = number;
		this.zipCode = zipcode;
		this.street = street;
		this.neighborhood = neigborhood;
		this.city = city;
		this.state = state;
	}
}
