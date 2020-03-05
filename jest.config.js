module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node'
};

if (process.env.NODE_ENV == null) {
    process.env.NODE_ENV = 'test';
}
