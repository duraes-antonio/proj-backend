const getNCharText = (length: number): string => {
    return [...Array(Math.max(0, length)).keys()]
      .map(() => 'A').join('');
};

/*Adaptado de: https://gist.github.com/solenoid/1372386*/
const getMongoOBjectId = (): string => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    const hexRandon = 'xxxxxxxxxxxxxxxx'
      .replace(
        /[x]/g,
        function() {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    return timestamp + hexRandon;
};


export const generators = {
    getNCharText,
    getMongoOBjectId
};
