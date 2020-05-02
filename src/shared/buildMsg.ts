import { ItemStock, Message } from '../controllers/base/response.functions';

export const validationErrorMsg = {
    maxLen(fieldName: string, maxLenght: number): string {
        return `O campo '${fieldName}' deve possuir no máximo ${maxLenght} caracteres`;
    },
    minLen(fieldName: string, minLenght: number): string {
        return `O campo '${fieldName}' deve possuir no mínimo ${minLenght} caracteres`;
    },
    maxLenList(fieldName: string, maxLenght: number): string {
        return `O campo '${fieldName}' deve possuir no máximo ${maxLenght} item`;
    },
    minLenList(fieldName: string, minLenght: number): string {
        return `O campo '${fieldName}' deve possuir ao menos ${minLenght} item`;
    },
    exactlyLen(fieldName: string, lenght: number): string {
        return `O campo '${fieldName}' deve possuir exatamente ${lenght} caracteres`;
    },
    maxValue(fieldName: string, maxVal: number): string {
        return `O campo '${fieldName}' não aceita valor maior que ${maxVal}`;
    },
    minValue(fieldName: string, minVal: number): string {
        return `O campo '${fieldName}' não aceita valor menor que ${minVal}`;
    },
    empty(fieldName: string): string {
        return `O campo '${fieldName}' deve ser preenchido`;
    },
    invalidFormat(fieldName: string): string {
        return `O campo ${fieldName} não está em um formato válido`;
    }
};

export const serviceDataMsg = {
    created(entity?: string): Message {
        return {
            message: `O item ${entity ? entity : ''} foi criado com êxito!`
        };
    },
    custom(msg: string): Message {
        return { message: msg };
    },
    deniedAccess(): Message {
        return { message: 'Acesso negado' };
    },
    deniedAccessItem(): Message {
        return { message: 'O usuário atual não possui acesso ao item solicitado' };
    },
    duplicate(entity: string, propName: string, propValue: string | number): Message {
        return {
            message:
              `O item ${entity}, de ${propName} '${propValue}' já existe`
        };
    },
    fieldsInvalid(fields: string[]): Message {
        return { message: `Os seguintes campos não são permitidos: ${fields.map(f => `"${f}"`).join(', ')}.` };
    },
    invalidId(id: string): Message {
        return { message: `O ID '${id}' não é válido para um documento` };
    },
    onlyAdmin(): Message {
        return { message: 'Somente administradores podem acessar o item solicitado' };
    },
    notEnoughStock(nameAvailable: ItemStock[]): Message {
        const bodyMsg = nameAvailable
          .map(nameQuantiy => {
              return `'${nameQuantiy.productName}' (disponível: ${nameQuantiy.quantityAvailable})`;
          });
        return {
            message: `Os seguintes items não estão disponíveis na quantidade solicitada ${bodyMsg.join(', ')}.`
        };
    },
    notFound(entity: string, propName: string, propValue: string | number): Message {
        return {
            message: `O item ${entity}, de ${propName} '${propValue}' não foi encontrado`
        };
    },
    notFoundMany(entity: string, propName: string, propValues: (string | number)[]): Message {
        const ids = propValues.map(id => `'${id}'`).join(', ');
        return {
            message: `Não foram encontrados itens ${entity}, com ${propName} igual a ${ids}.`
        };
    },
    success(): Message {
        return {
            message: 'Requisição executada com êxito!'
        };
    },
    tokenEmpty(): Message {
        return { message: 'Não foi possível encontrar o token de acesso' };
    },
    tokenExpired(): Message {
        return { message: 'O token atual está expirado. Realize o login novamente' };
    },
    tokenInvalid(): Message {
        return { message: 'O token atual é inválido' };
    },
    unknown(): Message {
        return {
            message: 'Houve um erro desconhecido ao tentar realizar a operação. Contate o Administrador do sistema'
        };
    },
    wrongPassword(): Message {
        return { message: 'A senha digitada está incorreta' };
    }
};
