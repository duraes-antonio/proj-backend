const paypal = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_CLIENT_SECRET
};

const pagSeguro = {
    email: process.env.PAGSEGURO_EMAIL,
    token: process.env.PAGSEGURO_TOKEN,
    urlCheckout: process.env.PAGSEGURO_CHECKOUT_URL
      || 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout',
    urlGetNotific: process.env.PAGSEGURO_NOTIFICATIONS_URL
      || 'https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications'
};

export const config = {
    pagSeguro,
    paypal
};
