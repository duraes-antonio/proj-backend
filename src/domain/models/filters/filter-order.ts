'use strict';
import { FilterBasic } from './filter-basic';
import { EStateOrder, OrderOptionsSort } from '../../enum/order';
import { PaymentStatus } from '../../enum/payment';

export interface FilterOrder extends FilterBasic {
    clientName?: string;
    dateEnd?: Date;
    dateStart?: Date;
    orderStatus?: EStateOrder;
    paymentStatus?: PaymentStatus;
    sortBy?: OrderOptionsSort;
}
