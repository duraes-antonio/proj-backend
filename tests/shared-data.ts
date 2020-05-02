import { UserAdd } from '../src/domain/models/user';
import { EUserRole } from '../src/domain/enum/role.enum';
import { App } from '../src/app';
import { serviceDataMsg, validationErrorMsg } from '../src/shared/buildMsg';
import { StringOptional } from './shared-methods-http';
import { generators } from '../utils/generators';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

export interface TestObject<T> {
    data: T;
    expectStatus: number;
    message: string;
}

async function getTokenValid(user: UserAdd, app: App): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

function getTestsForCheckEmptyFields(nameField: string | string[], status: number): TestObject<object>[] {
    const fields: string[] = nameField instanceof Object ? [...nameField] : [nameField];
    return fields.map(
      nameField => {
          return [
              {
                  data: { [nameField]: '' },
                  expectStatus: status,
                  message: validationErrorMsg.empty(nameField)
              },
              {
                  data: { [nameField]: null },
                  expectStatus: status,
                  message: validationErrorMsg.empty(nameField)
              }
          ];
      }).flat();
}

function getTestsForStringFields<T>(fields: string[], objectSizes: any): TestObject<object>[] {
    return fields.map(
      nameField => {
          return [
              ...getTestsForCheckEmptyFields(nameField, 400),
              {
                  data: { [nameField]: generators.getNCharText(objectSizes[`${nameField}Min`] - 1) },
                  expectStatus: 400,
                  message: validationErrorMsg.minLen(nameField, objectSizes[`${nameField}Min`])
              },
              {
                  data: { [nameField]: generators.getNCharText(objectSizes[`${nameField}Max`] + 1) },
                  expectStatus: 400,
                  message: validationErrorMsg.maxLen(nameField, objectSizes[`${nameField}Max`])
              }
          ];
      }
    ).flat();
}

function getTestsForNumberFields<T>(fields: string[], objectSizes: any): TestObject<object>[] {
    return fields.map(
      nameField => {
          return [
              ...getTestsForCheckEmptyFields(nameField, 400),
              {
                  data: { [nameField]: objectSizes[`${nameField}Min`] - 1 },
                  expectStatus: 400,
                  message: validationErrorMsg.minValue(nameField, objectSizes[`${nameField}Min`])
              },
              {
                  data: { [nameField]: objectSizes[`${nameField}Max`] + 1 },
                  expectStatus: 400,
                  message: validationErrorMsg.maxValue(nameField, objectSizes[`${nameField}Max`])
              }
          ];
      }
    ).flat();
}

function getTestsForListFields<T>(fields: string[], objectSizes: any): TestObject<object>[] {
    return fields.map(
      nameField => {
          const cases = [
              {
                  data: { [nameField]: null },
                  expectStatus: 400,
                  message: validationErrorMsg.empty(nameField)
              },
              {
                  data: { [nameField]: generators.getMongoOBjectIds(objectSizes[`${nameField}Max`] + 1) },
                  expectStatus: 400,
                  message: validationErrorMsg.maxLenList(nameField, objectSizes[`${nameField}Max`])
              }
          ];

          if (objectSizes[`${nameField}Min`] > 0) {
              cases.push({
                  data: { [nameField]: [] },
                  expectStatus: 400,
                  message: validationErrorMsg.minLenList(nameField, objectSizes[`${nameField}Min`])
              });
          }

          return cases;
      }
    ).flat();
}

function getTestForCustomStrFields<T>(fields: string[], objectSizes: any): TestObject<object>[] {
    return fields.map(
      nameField => {
          return [
              ...getTestsForCheckEmptyFields(nameField, 400),
              {
                  data: { [nameField]: generators.getNCharText(objectSizes[`${nameField}Max`]) },
                  expectStatus: 400,
                  message: validationErrorMsg.invalidFormat(nameField)
              }
          ];
      }
    ).flat();
}

export const cmp = <T>(obj1: T, obj2: T, fnAccessProp: (obj: T) => string | number): number => {
    if (fnAccessProp(obj1) < fnAccessProp(obj2)) {
        return -1;
    } else if (fnAccessProp(obj1) > fnAccessProp(obj2)) {
        return 1;
    }
    return 0;
};


type UserAddTest = {
    admin: UserAdd;
    joao: UserAdd;
    maria: UserAdd;
};

export const usersAdd: UserAddTest = {
    admin: {
        codeArea: 27,
        cpf: '51815426039',
        email: 'admin@teste.com',
        name: 'Admin',
        password: '12345678',
        phone: '998227412',
        roles: [EUserRole.ADMIN]
    },
    joao: {
        cpf: '46913159005',
        codeArea: 21,
        email: 'joao@teste.com',
        name: 'João da Silva',
        password: '12345678',
        phone: '997227411',
        roles: [EUserRole.CUSTOMER]
    },
    maria: {
        codeArea: 11,
        cpf: '37035230009',
        email: 'maria@teste.com',
        name: 'Maria Santos',
        password: '12345678',
        phone: '995124411',
        roles: [EUserRole.CUSTOMER]
    }
};

export const invalidIds: [StringOptional, number][] = [
    [null, 400],
    [undefined, 400],
    ['_', 400],
    ['8e1be7c2cc5369bc048e8d53', 404]
];

export const invalidFieldsPatch: TestObject<any>[] = [
    {
        data: { _id: '8e1be7c2cc5369bc048e8d53' },
        message: serviceDataMsg.fieldsInvalid(['_id']).message,
        expectStatus: 400
    },
    {
        data: { id: null },
        message: serviceDataMsg.fieldsInvalid(['id']).message,
        expectStatus: 400
    },
    {
        data: { inexist: null },
        message: serviceDataMsg.fieldsInvalid(['inexist']).message,
        expectStatus: 400
    }
];

export const sharedDataTest = {
    getTokenValid,
    getTestsForCheckEmptyFields,
    getTestForCustomStrFields,
    getTestsForListFields,
    getTestsForStringFields,
    getTestsForNumberFields
};
