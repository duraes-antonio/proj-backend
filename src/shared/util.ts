import * as _ from 'lodash';

const _orderedAscending = <T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) > fnAcessProp(list[i + 1])
    );
};

const _orderedDescending = <T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) < fnAcessProp(list[i + 1])
    );
};

/*Adaptado de:
* https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
*/
const _chunckArray = <T>(array: T[], sizePart: number): T[][] => {
    return Array.from(
      { length: Math.ceil(array.length / sizePart) },
      (v, i) => array.slice(i * sizePart, i * sizePart + sizePart)
    );
};

const _fromObjectIgnore = (objectSource: object, valueIgnore: any): object =>
  _.pickBy(objectSource, (value) => value !== valueIgnore);

const _validIdHex = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

export const utilService = {
    chunckArray: _chunckArray,
    fromObjectIgnore: _fromObjectIgnore,
    orderedAscending: _orderedAscending,
    orderedDescending: _orderedDescending,
    validIdHexadecimal: _validIdHex
};
