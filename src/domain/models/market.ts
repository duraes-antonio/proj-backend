'use strict';

export class Market {
    readonly id: number;
    readonly imageUrl: string;
    readonly logoImgUrl: string;
    readonly name: string;
    readonly url: string;

    constructor(
      id: number, urlBackground: string, urlLogo: string, name: string,
      url: string
    ) {
        this.id = id;
        this.imageUrl = urlBackground;
        this.logoImgUrl = urlLogo;
        this.name = name;
        this.url = url;
    }
}
