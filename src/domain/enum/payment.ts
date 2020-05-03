'use strict';

export enum PaymentMethod {
    MERCADO_PAGO = 'mercado_pago',
    PAG_SEGURO = 'pag_seguro',
    PAYPAL = 'paypal'
}

/*Flow: created -> peding -> approved*/
export enum PaymentStatus {
    APPROVED = 'approved',
    CANCELED = 'canceled',
    CREATED = 'created',
    PENDING = 'peding',
    RETURNED = 'returned'
}

export enum PagSeguroStatusTransaction {
    AGUARDANDO_PAGAMENTO = 1,
    EM_ANALISE = 2,
    PAGA = 3,
    DISPONIVEL = 4,
    EM_DISPUTA = 5,
    DEVOLVIDA = 6,
    CANCELADA = 7,
}
