'use strict';
import { Registable } from '../auditable';

export interface MarketAdd {
    readonly avatarUrl: string;
    readonly backgroundUrl: string;
    readonly index: number;
    readonly name: string;
    readonly url: string;
}

export interface Market extends MarketAdd, Registable {
}
