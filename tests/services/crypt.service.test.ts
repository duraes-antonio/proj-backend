'use strict';

import { cryptService } from '../../src/services/crypt.service';

const password = '12345678';
const password2 = '12345679';
const salt = '$2y$12$.Xn7.JT3GeYJS5JlwgDeFeL6GxI/8K6RqTpmzSmsLtcQIthnJz8T.';
const salt2 = '$2y$12$D/1edy1JIbyN64bE403B5.tZWD3sQcxzseQkqSF0rwCdjGLIgT/4i';

describe('Crypt Service', () => {
    it(
      'True - Senha correta',
      async () => {
          const passEncrypt = await cryptService.encryptSalt(password, salt);
          const equalPass = await cryptService.compare(password, passEncrypt);
          expect(equalPass).toBeTruthy();
      });
    it(
      'False - Senhas iguais c/ salts diferentes',
      async () => {
          const passEncrypt = await cryptService.encryptSalt(password, salt);
          const passEncrypt2 = await cryptService.encryptSalt(password, salt2);
          const equalPassCrypted = passEncrypt === passEncrypt2;
          expect(equalPassCrypted).toBeFalsy();
      });
    it(
      'False - Senhas texto-plano diferentes em 1 char',
      async () => {
          const passEncrypt = await cryptService.encrypt(password2);
          const equalPassCrypted = await cryptService.compare(password, passEncrypt);
          expect(equalPassCrypted).toBeFalsy();
      });
});
