'use strict';
import { validationErrorMsg } from './buildMsg';
/* tslint:disable-next-line:max-line-length
 * Expressão baseada no regex usado na API do Angular Form Validators:
 * https://github.com/angular/angular/blob/e0ad9ecda0b8a541b405d2ab35335b90ceb21fd1/packages/forms/src/validators.ts#L254
*/
const regexEmail = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const regexPhone = /^\([1-9]{2}\)\s?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;

const validation = {
    atMaxLen(value: string | undefined, maxLenght: number): boolean {
        // eslint-disable-next-line
        // @ts-ignore
        return this.hasValue(value) && value.length <= maxLenght;
    },
    atLeastLen(value: string | undefined, minLenght: number): boolean {
        // eslint-disable-next-line
        // @ts-ignore
        return this.hasValue(value) && value.length >= minLenght;
    },
    atLeastLenList(value: ArrayLike<any>, minLenght: number): boolean {
        return this.hasValue(value) && value.length >= minLenght;
    },
    exactlytLen(value: string, lenght: number): boolean {
        return this.hasValue(value) && value.length === lenght;
    },
    atMaxLenList(value: ArrayLike<any>, maxLenght: number): boolean {
        return this.hasValue(value) && value.length <= maxLenght;
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
    private readonly _ignoreUndefined: boolean;

    constructor(fnEmptyOrNull?: (field: string) => string, ignoreUndefined = false) {
        this._ignoreUndefined = ignoreUndefined;
        this.fnEmpty = fnEmptyOrNull ? fnEmptyOrNull : validationErrorMsg.empty;
    }

    get valid(): boolean {
        return !this.errors.length;
    }

    hasValue<T>(field: string, value: T | T[]): PipelineValidation {
        return this.checkValuesAndFillError<T>(
          value,
          (v: T) => validation.hasValue(v),
          () => this.fnEmpty(field),
          () => this.fnEmpty(field)
        );
    }

    atMaxLen(
      field: string, value: string | undefined, maxLenght: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {

        if (!this.isEmpty(value, field) && !validation.atMaxLen(value, maxLenght)) {
            this.errors.push(fnMsg(field, maxLenght));
        }
        return this;
    }

    atLeastLen(
      field: string, value: string | undefined, minLenght: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {
        if (!this.isEmpty(value, field) && !validation.atLeastLen(value, minLenght)) {
            this.errors.push(fnMsg(field, minLenght));
        }
        return this;
    }

    atLeastLenList<T>(
      field: string, value: ArrayLike<T>, minLenght: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {
        if (!this.isEmpty(value, field)
          && !validation.atLeastLenList(value, minLenght)
        ) {
            this.errors.push(fnMsg(field, minLenght));
        }
        return this;
    }

    exactlytLen(
      field: string, value: string, lenght: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {
        if (!this.isEmpty(value, field) && !validation.exactlytLen(value, lenght)) {
            this.errors.push(fnMsg(field, lenght));
        }
        return this;
    }

    atMaxLenList<T>(
      field: string, value: ArrayLike<T>, minLenght: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {
        if (!this.isEmpty(value, field)
          && !validation.atMaxLenList(value, minLenght)
        ) {
            this.errors.push(fnMsg(field, minLenght));
        }
        return this;
    }

    atMaxValue(
      field: string, value: undefined | number | number[], maxVal: number,
      fnMsg: (field: string, max: number) => string
    ): PipelineValidation {
        return this.checkValuesAndFillError<number>(
          value,
          (v: number) => validation.atMaxValue(v, maxVal),
          () => fnMsg(field, maxVal),
          () => this.fnEmpty(field)
        );
    }

    atLeastValue(
      field: string, value: undefined | number | number[], minVal: number,
      fnMsg: (field: string, min: number) => string
    ): PipelineValidation {
        return this.checkValuesAndFillError<number>(
          value,
          (v: number) => validation.atLeastValue(v, minVal),
          () => fnMsg(field, minVal),
          () => this.fnEmpty(field)
        );
    }

    validCEP(field: string, cep: string, fnMsg: (field: string) => string): PipelineValidation {
        if (!this.isEmpty(cep, field) && !validation.validCEP(cep)) {
            this.errors.push(fnMsg(field));
        }
        return this;
    }

    validEmail(field: string, email: string, fnMsg: (field: string) => string): PipelineValidation {
        if (!this.isEmpty(email, field) && !validation.validEmail(email)) {
            this.errors.push(fnMsg(field));
        }
        return this;
    }

    validPhone(field: string, number: string, fnMsg: (field: string) => string): PipelineValidation {
        if (!this.isEmpty(number, field) && !validation.validPhone(number)) {
            this.errors.push(fnMsg(field));
        }
        return this;
    }

    private checkValuesAndFillError<T>(
      value: undefined | T | T[], fnValidate: (v: T) => boolean,
      fnMsg: () => string, fnMsgEmpty: () => string
    ): PipelineValidation {
        const newErrors = this.getMsgsErrorsPure(
          value, fnValidate, (v) => this._isEmpty(v, this._ignoreUndefined),
          fnMsg, fnMsgEmpty
        );
        newErrors.forEach(msgError => this.errors.push(msgError));
        return this;
    }

    private getMsgsErrorsPure<T>(
      values: undefined | T | T[], fnCheckValidT: (v: T) => boolean,
      fnCheckIsEmpty: (v?: T) => boolean, fnMsg: () => string, fnMsgEmpty: () => string
    ): string[] {
        const pipelineMsgsError = (value?: T): string | undefined => {
            if (fnCheckIsEmpty(value)) {
                return fnMsgEmpty();
            } else if (value !== undefined && !fnCheckValidT(value)) {
                return fnMsg();
            }
        };

        if (values instanceof Array) {
            return values
              .map(item => pipelineMsgsError(item))
              .filter(msg => !!msg)
              .map((msg, i: number) => `${i + 1}º Item: ${msg}`);
        } else {
            const msg = pipelineMsgsError(values);
            return !!msg ? [msg] : [];
        }
    }

    private _isEmpty<T>(value: T, ignoreUndefined: boolean): boolean {
        return !(validation.hasValue(value) || (value === undefined && ignoreUndefined));
    }

    private isEmpty<T>(value: T, field: string): boolean {
        if (!validation.hasValue(value)) {
            if (!this._ignoreUndefined || value !== undefined) {
                this.errors.push(this.fnEmpty(field));
            }
            return true;
        }
        return false;
    }
}

export { validation };
