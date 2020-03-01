export const validationErrorMsg = {
	maxLen(fieldName: string, maxLenght: number): string {
		return `O campo ${fieldName} deve possuir no máximo ${maxLenght} caracteres`;
	},
	minLen(fieldName: string, minLenght: number): string {
		return `O campo ${fieldName} deve possuir no mínimo ${minLenght} caracteres`;
	},
	exactlyLen(fieldName: string, lenght: number): string {
		return `O campo ${fieldName} deve possuir exatamente ${lenght} caracteres`;
	},

	maxValue(fieldName: string, maxVal: number): string {
		return `O campo ${fieldName} não aceita valor maior que ${maxVal}`;
	},
	minValue(fieldName: string, minVal: number): string {
		return `O campo ${fieldName} não aceita valor menor que ${minVal}`;
	},
	empty(fieldName: string): string {
		return `O campo ${fieldName} deve ser preenchido`;
	},

	invalidFormat(fieldName: string): string {
		return `O campo ${fieldName} não está em um formato válido`;
	}
};

export const serviceDataMsg = {
	deniedAccess(): string {
		return `Acesso negado`;
	},
	deniedAccessItem(): { message: string } {
		return { message: `O usuário atual não possui acesso ao item solicitado` };
	},
	duplicate(entity: string, propName: string, propValue: string | number): { message: string } {
		return {
			message:
			  `O item ${entity}, de ${propName} '${propValue}' já existe`
		};
	},
	onSave(entityName: string): { message: string } {
		return { message: `Houve um erro ao tentar salvar o objeto ${entityName}` };
	},
	notFound(entity: string, propName: string, propValue: string | number): { message: string } {
		return {
			message: `O item ${entity}, de ${propName} '${propValue}' não foi encontrado`
		};
	},
	tokenEmpty(): string {
		return `Não foi possível encontrar o token de acesso`;
	},
	tokenExpired(): { message: string } {
		return { message: `O token atual está expirado. Realize o login novamente.` };
	},
	tokenInvalid(): { message: string } {
		return { message: `O token atual é inválido` };
	},
	unknown(): { message: string } {
		return {
			message: `Houve um erro desconhecido ao tentar realizar a operação. Contate o Administrador do sistema`
		};
	},
	userNotFound(): { message: string } {
		return {
			message: `Não foi possível encontrar uma conta com email e senha informados`
		};
	},
	wrongPassword(): { message: string } {
		return { message: `A senha digitada está incorreta` };
	}
};
