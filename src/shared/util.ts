function orderedAscending<T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) > fnAcessProp(list[i + 1])
    );
}

function orderedDescending<T>(list: T[], fnAcessProp: (obj: T) => string | number | Date): boolean {
    return !list.some((v, i) =>
      list[i + 1] && fnAcessProp(v) < fnAcessProp(list[i + 1])
    );
}

export const utilService = {
    orderedAscending,
    orderedDescending
};
