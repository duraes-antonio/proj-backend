'use strict';
import { OrderSchema } from '../schemas/order.schema';

const _productPurchased = async (userId: string, productId: string): Promise<boolean> => {
    return await OrderSchema.exists({
        $and: [
            { userId },
            { productsId: { $in: [productId] } }
        ]
    });
};

export const orderRepository = {
    productPurchased: _productPurchased
};
