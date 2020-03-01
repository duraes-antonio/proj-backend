'use strict';

import { config } from '../config';

const bcrypt = require('bcryptjs');

async function encrypt(pass: string): Promise<string> {
    return await this.encryptSalt(pass, config.saltKey);
}

async function encryptSalt(pass: string, salt: string): Promise<string> {
    return await bcrypt.hash(pass, salt);
}

async function compare(plain: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plain, encrypted);
}

export const cryptService = {
    compare: compare,
    encrypt: encrypt,
    encryptSalt: encryptSalt
};
