'use strict';

export class Review {
    readonly id: number;
    readonly productId: number;
    readonly comment: string;
    readonly date?: Date;
    readonly value: number;
    readonly title: string;

    readonly userName: string;
    readonly userAvatarUrl: string;

    constructor(
      value: number, title: string, comment: string, userName: string,
      userAvatarUrl: string, productId: number, id: number = 0, date?: Date) {
        this.id = id;
        this.productId = productId;
        this.comment = comment;
        this.date = date;
        this.value = value;
        this.title = title;

        this.userName = userName;
        this.userAvatarUrl = userAvatarUrl;
    }
}
