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
    created(entity?: string): { message: string } {
        return {
            message: `O item ${entity ? entity : ''} foi criado com êxito!`
        };
    },
    custom(msg: string): { message: string } {
        return { message: msg };
    },
    deniedAccess(): { message: string } {
        return { message: 'Acesso negado' };
    },
    deniedAccessItem(): { message: string } {
        return { message: 'O usuário atual não possui acesso ao item solicitado' };
    },
    duplicate(entity: string, propName: string, propValue: string | number): { message: string } {
        return {
            message:
              `O item ${entity}, de ${propName} '${propValue}' já existe`
        };
    },
    fieldsInvalid(fields: string[]): { message: string } {
        return { message: `Os seguintes campos não são permitidos: ${fields.map(f => `"${f}"`).join(', ')}.` };
    },
    invalidId(id: string): { message: string } {
        return { message: `O ID '${id}' não é válido para um documento` };
    },
    onlyAdmin(): { message: string } {
        return { message: 'Somente administradores podem acessar o item solicitado' };
    },
    notFound(entity: string, propName: string, propValue: string | number): { message: string } {
        return {
            message: `O item ${entity}, de ${propName} '${propValue}' não foi encontrado`
        };
    },
    success(): { message: string } {
        return {
            message: 'Requisição executada com êxito!'
        };
    },
    tokenEmpty(): string {
        return 'Não foi possível encontrar o token de acesso';
    },
    tokenExpired(): { message: string } {
        return { message: 'O token atual está expirado. Realize o login novamente' };
    },
    tokenInvalid(): { message: string } {
        return { message: 'O token atual é inválido' };
    },
    unknown(): { message: string } {
        return {
            message: 'Houve um erro desconhecido ao tentar realizar a operação. Contate o Administrador do sistema'
        };
    },
    wrongPassword(): { message: string } {
        return { message: 'A senha digitada está incorreta' };
    }
};
