enum EEnv {
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test',
    TEST_DEV = 'test-dev'
}

function getPathFileEnv(envEnum: EEnv): string  {
    const mapEnvPath = {
        [EEnv.DEV]: '.env.dev',
        [EEnv.PROD]: '.env.prod',
        [EEnv.TEST]: '.env.test',
        [EEnv.TEST_DEV]: '.env.test_dev'
    };
    return mapEnvPath[envEnum];
}

function getConnString(envEnum: EEnv): string  {
    const mapEnvPath = {
        [EEnv.DEV]: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
        [EEnv.PROD]: `mongodb+srv://${process.env.MONGODB_PROD_USER}:${process.env.MONGODB_PROD_PASS}@prod-fpioj.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        [EEnv.TEST]: `mongodb+srv://teste:teste@yugishop-ywmam.mongodb.net/test?retryWrites=true&w=majority`,
        [EEnv.TEST_DEV]: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
    };
    return mapEnvPath[envEnum];
}

require('dotenv').config({
    path: process.env.NODE_ENV
      ? getPathFileEnv(process.env.NODE_ENV as EEnv)
      : getPathFileEnv(EEnv.DEV)
});

export const config = {
    connectionString: process.env.NODE_ENV
      ? getConnString(process.env.NODE_ENV as EEnv)
      : getConnString(EEnv.DEV),
    saltKey: '$2y$12$Z3WVfpZ8KxH5IvGXzo6A9u1dI9d8ChREs3sQ/sL9f1.StstSvJXny'
};
