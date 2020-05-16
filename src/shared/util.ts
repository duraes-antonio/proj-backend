import * as _ from 'lodash';

type Comparable = string | number | Date;

const _orderedAscending = <T>(list: T[], fnAcessProp: (obj: T) => Comparable): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) > fnAcessProp(list[i + 1])
    );
};

const _orderedDescending = <T>(list: T[], fnAcessProp: (obj: T) => Comparable): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) < fnAcessProp(list[i + 1])
    );
};

const _compareAscending = <T>(a: T, b: T, fnAccessProp: (obj: T) => Comparable): number => {
    if (fnAccessProp(a) > fnAccessProp(b)) {
        return 1;
    }
    return fnAccessProp(a) < fnAccessProp(b) ? -1 : 0;
};

const _compareDescending = <T>(a: T, b: T, fnAccessProp: (obj: T) => Comparable): number => {
    if (fnAccessProp(a) > fnAccessProp(b)) {
        return -1;
    }
    return fnAccessProp(a) < fnAccessProp(b) ? 1 : 0;
};

const _orderAscending = <T>(list: T[], fnAcessProp: (obj: T) => Comparable): T[] => {
    return list.sort((a, b) => _compareAscending(a, b, fnAcessProp));
};

const _orderDescending = <T>(list: T[], fnAcessProp: (obj: T) => Comparable): T[] => {
    return list.sort((a, b) => _compareDescending(a, b, fnAcessProp));
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
    orderAscending: _orderAscending,
    orderDescending: _orderDescending,
    orderedAscending: _orderedAscending,
    orderedDescending: _orderedDescending,
    validIdHexadecimal: _validIdHex
};
