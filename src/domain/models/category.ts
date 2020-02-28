'use strict';

export class Category {
	readonly id: number;
	readonly name: string;

	constructor(name: string, id: number) {
		this.name = name;
		this.id = id;
	}
}
