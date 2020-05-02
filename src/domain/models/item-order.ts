'use strict';

import { Registable } from './auditable';
import { Product } from './product';

export interface ItemOrderAdd {
    readonly quantity: number;
    readonly productId: string;
    readonly unitPrice: number;
}

export interface ItemOrder extends ItemOrderAdd, Registable {
    readonly product: Product;
}
