'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

async function encryptSalt(pass: string, salt: string): Promise<string> {
    return await bcrypt.hash(pass, salt);
}

async function encrypt(pass: string): Promise<string> {
    return await encryptSalt(pass, process.env.SALT_KEY as string);
}

async function compare(plain: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plain, encrypted);
}

export const cryptService = {
    compare: compare,
    encrypt: encrypt,
    encryptSalt: encryptSalt
};
