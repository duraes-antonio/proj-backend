export const addressSizes = {
    cityMax: 64,
    numberMax: Number.MAX_SAFE_INTEGER,
    neighborhoodMax: 64,
    stateMax: 64,
    streetMax: 128,
    zipCodeMax: 9
};

export const categorySizes = {
    titleMax: 128
};

export const productSizes = {
    titleMax: 128,
    descMax: 4000,
    urlMainImageMax: 512,
    priceMin: 0,
    priceMax: Number.MAX_SAFE_INTEGER,
    percentOffMin: 0,
    percentOffMax: 100,
    avgReviewMin: 0,
    avgReviewMax: 5,
    amountAvailableMin: 0,
    amountAvailableMax: Number.MAX_SAFE_INTEGER
};

export const reviewSizes = {
    commentMin: 10,
    commentMax: 512,
    ratingMin: 0,
    ratingMax: 5,
    titleMin: 10,
    titleMax: 128,
};

export const userSizes = {
    emailMax: 128,
    nameMax: 128,
    passwordMax: 128,
    passwordMin: 8,
    phoneMax: 16
};
