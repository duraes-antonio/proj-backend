const orderedAscending = <T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) > fnAcessProp(list[i + 1])
    );
};

const orderedDescending = <T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean => {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) < fnAcessProp(list[i + 1])
    );
};

/*Adaptado de:
* https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
*/
const chunckArray = <T>(array: T[], sizePart: number): T[][] => {
    return Array.from(
      { length: Math.ceil(array.length / sizePart) },
      (v, i) => array.slice(i * sizePart, i * sizePart + sizePart)
    );
};

export const utilService = {
    chunckArray,
    orderedAscending,
    orderedDescending
};
