require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export const config = {
    connectionString: `mongodb+srv://teste:teste@yugishop-ywmam.mongodb.net/test?retryWrites=true&w=majority`,
    // connectionString: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    saltKey: '$2y$12$Z3WVfpZ8KxH5IvGXzo6A9u1dI9d8ChREs3sQ/sL9f1.StstSvJXny',
    sendgridApiKey: `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`
};
