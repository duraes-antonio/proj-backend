if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {'^.+\\.ts$': 'ts-jest'},
  testMatch: ['**/tests/*.+(ts|tsx|js)'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfigFile: "tsconfig.json",
      diagnostics: false
    }
  }
};
