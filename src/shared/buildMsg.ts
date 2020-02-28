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
	invalidToken(): string {
		return `O token atual é inválido`;
	},
	onSave(entityName: string): string {
		return `Houve um erro ao tentar salvar o objeto ${entityName}`;
	},
	notFound(entityName: string, propName: string, propValue: string | number): string {
		return `O item ${entityName}, de ${propName} '${propValue}' não foi encontrado`;
	},
	unknown(): string {
		return `Houve um erro desconhecido ao tentar realizar a operação. Contate o Administrador do sistema`;
	}
};
