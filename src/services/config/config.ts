// TODO: Mover variáveis p/ heroku
const paypal = {
    clientId: 'AXg0OUZI4L1NOOWjPyQM-WRBA-gmkNJU4dn0ZZKDbgZ08UF-DaqIQbv0afTG5NrrEW15GmAx94nXuqeo',
    mode: 'sandbox',
    ppSandboxAcc: 'sb-1guzs1303671@business.example.com',
    secret: 'EHc8BkuG7LR92TxIshn6lE4I6aPa0axwYp5f1M3QFImlnMHN6pQwPd-qj64mZvUSU4UBma_AzRHLBQuv',
    token: 'access_token$sandbox$hj8cqm69twn66kkz$6d5682a1fe62837ab5987ff2a1403b5b'
};

const mercadoPago = {
    accessToken: 'TEST-3107636530296593-042605-6aa349cefb51884ff9f4eaf25b6941f1-161817986'
};

const pagSeguro = {
    email: 'garotoseis@gmail.com',
    token: 'FB5111DBF8A045F6B9475457D91BC12C',
    url: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout'
};


export const config = {
    mercadoPago,
    pagSeguro,
    paypal
};
