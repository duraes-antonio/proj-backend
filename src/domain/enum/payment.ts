'use strict';

export enum PaymentMethod {
    PAG_SEGURO = 'pag_seguro',
    PAYPAL = 'paypal'
}

/*Flow: created -> peding -> approved*/
export enum PaymentStatus {
    APPROVED = 'approved',
    CANCELED = 'canceled',
    CREATED = 'created',
    PENDING = 'pending',
    RETURNED = 'returned'
}

export enum PagSeguroStatusPayment {
    AGUARDANDO_PAGAMENTO = 1,
    EM_ANALISE = 2,
    PAGA = 3,
    DISPONIVEL = 4,
    EM_DISPUTA = 5,
    DEVOLVIDA = 6,
    CANCELADA = 7,
}

export enum PayPalStatusPayment {
    COMPLETED = 'COMPLETED',
    DECLINED = 'DECLINED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    PENDING = 'PENDING',
    REFUNDED = 'REFUNDED',
}
