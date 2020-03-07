require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export const config = {
    connectionString: process.env.NODE_ENV !== 'test'
      ? `mongodb+srv://teste:teste@yugishop-ywmam.mongodb.net/test?retryWrites=true&w=majority`
      : `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    saltKey: '$2y$12$Z3WVfpZ8KxH5IvGXzo6A9u1dI9d8ChREs3sQ/sL9f1.StstSvJXny',
};
