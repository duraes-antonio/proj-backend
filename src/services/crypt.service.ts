import { config } from '../config';

const crypto = require('crypto');

export const cryptService = {
	encrypt(pass: string): string {
		return this.encryptSalt(pass, config.saltKey);
	},
	encryptSalt(pass: string, salt: string): string {
		return crypto.createHmac('sha256', salt)
		  .update(pass)
		  .digest('hex');
	}
};
