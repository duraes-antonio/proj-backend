'use strict';

/* tslint:disable-next-line:max-line-length
 * Expressão baseada no regex usado na API do Angular Form Validators:
 * https://github.com/angular/angular/blob/e0ad9ecda0b8a541b405d2ab35335b90ceb21fd1/packages/forms/src/validators.ts#L254
*/
const regexEmail = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const regexPhone = /^\([1-9]{2}\)\s?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;

const validation = {
	atMaxLen(value: string, maxLenght: number): boolean {
		return this.hasValue(value) && value.length <= maxLenght;
	},
	atLeastLen(value: string, minLenght: number): boolean {
		return this.hasValue(value) && value.length >= minLenght;
	},
	exactlytLen(value: string, lenght: number): boolean {
		return this.hasValue(value) && value.length === lenght;
	},
	atMaxValue(value: number, maxVal: number): boolean {
		return value !== undefined && value !== null && value <= maxVal;
	},
	atLeastValue(value: number, minVal: number): boolean {
		return value !== undefined && value !== null && value >= minVal;
	},
	hasValue(value: any): boolean {
		return !(value === undefined || value == null || value === '');
	},
	validCEP(cep: string): boolean {
		return validation.hasValue(cep) && validation.exactlytLen(cep, 8);
	},
	validEmail(email: string): boolean {
		return this.hasValue(email) && regexEmail.test(email);
	},
	validPhone(number: string): boolean {
		return this.hasValue(number) && regexPhone.test(number);
	}
};

export class PipelineValidation {
	readonly errors: string[] = [];
	readonly fnEmpty: (field: string) => string;

	constructor(fnEmptyOrNull: (field: string) => string) {
		this.fnEmpty = fnEmptyOrNull;
	}

	get valid(): boolean {
		return !this.errors.length;
	}

	atMaxLen(
	  field: string, value: string, maxLenght: number,
	  fnMsg: (field: string, max: number) => string
	) {

		if (!this.isEmpty(value, field) && !validation.atMaxLen(value, maxLenght)) {
			this.errors.push(fnMsg(field, maxLenght));
		}
		return this;
	}

	atLeastLen(
	  field: string, value: string, minLenght: number,
	  fnMsg: (field: string, max: number) => string
	) {
		if (!this.isEmpty(value, field) && !validation.atLeastLen(value, minLenght)) {
			this.errors.push(fnMsg(field, minLenght));
		}
		return this;
	}

	exactlytLen(
	  field: string, value: string, lenght: number,
	  fnMsg: (field: string, max: number) => string
	) {
		if (!this.isEmpty(value, field) && !validation.exactlytLen(value, lenght)) {
			this.errors.push(fnMsg(field, lenght));
		}
		return this;
	}

	atMaxValue(
	  field: string, value: number, maxVal: number,
	  fnMsg: (field: string, max: number) => string
	) {
		if (!this.isEmpty(value, field) && !validation.atMaxValue(value, maxVal)) {
			this.errors.push(fnMsg(field, maxVal));
		}
		return this;
	}

	atLeastValue(
	  field: string, value: number, minVal: number,
	  fnMsg: (field: string, max: number) => string
	) {
		if (!this.isEmpty(value, field) && !validation.atLeastValue(value, minVal)) {
			this.errors.push(fnMsg(field, minVal));
		}
		return this;
	}

	validCEP(
	  field: string, cep: string,
	  fnMsg: (field: string) => string
	) {
		if (!this.isEmpty(cep, field) && !validation.validCEP(cep)) {
			this.errors.push(fnMsg(field));
		}
		return this;
	}

	validEmail(
	  field: string, email: string,
	  fnMsg: (field: string) => string
	) {
		if (!this.isEmpty(email, field) && !validation.validEmail(email)) {
			this.errors.push(fnMsg(field));
		}
		return this;
	}

	validPhone(
	  field: string, number: string,
	  fnMsg: (field: string) => string
	) {
		if (!this.isEmpty(number, field) && !validation.validPhone(number)) {
			this.errors.push(fnMsg(field));
		}
		return this;
	}

	private isEmpty(value: any, field: string): boolean {
		if (!validation.hasValue(value)) {
			this.errors.push(this.fnEmpty(field));
			return true;
		}
		return false;
	}
}

export { validation };
