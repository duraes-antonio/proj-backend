'use strict';

export class ItemOrder {
	readonly id: number;
	readonly amount: number;
	readonly unitPrice: number;
	readonly productId: number;

	constructor(id: number, amount: number, unitPrice: number, productId: number) {
		this.id = id;
		this.amount = amount;
		this.unitPrice = unitPrice;
		this.productId = productId;
	}
}
