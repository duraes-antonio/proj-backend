'use strict';

export class User {
	avatarUrl?: string;
	name: string;
	email: string;

	// TODO: Trabalhar com endereço, redes sociais, permissões/role
	constructor(name: string, email: string, urlImg?: string) {
		this.name = name;
		this.email = email;
		this.avatarUrl = urlImg;
	}
}
