'use strict';

export interface LinkAdd {
    readonly title: string;
    readonly url: string;
}

export interface Link extends LinkAdd {
    readonly id: string;
}
