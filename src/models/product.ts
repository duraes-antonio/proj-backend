'use strict';
import { Category } from './category';

export class Product {

	id = 0;
	title: string;
	desc: string;
	urlImage?: string;

	price = 0;
	priceWithDiscount = 0;
	percentOff = 0;

	freeDelivery = false;
	categories: Category[] = [];
	avgReview = 0;
	amountAvailable = 0;

	constructor(
	  title: string, desc: string, priceSell: number, urlImg?: string,
	  percOff?: number, categories?: Category[], freeDelivery?: boolean,
	  id?: number, amountAvailable?: number, avgReview?: number
	) {
		this.title = title;
		this.desc = desc;
		this.price = priceSell;
		this.urlImage = urlImg ? urlImg : this.urlImage;
		this.freeDelivery = !!freeDelivery ? freeDelivery : false;
		this.percentOff = percOff ? percOff : this.percentOff;
		this.priceWithDiscount = this.percentOff > 0 ? this.price * (100 - this.percentOff) / 100 : this.price;
		this.categories = categories ? categories : [];
		this.id = id ? id : this.id;
		this.amountAvailable = amountAvailable ? amountAvailable : this.amountAvailable;
		this.avgReview = avgReview ? avgReview : this.avgReview;
	}
}
