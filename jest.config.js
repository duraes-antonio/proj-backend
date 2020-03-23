if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

module.exports = {
  moduleFileExtensions: ["js", "ts"],
  testResultsProcessor: "jest-sonar-reporter",
  transform: { "^.+\\.ts$": "ts-jest" },
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  preset: "ts-jest",
  testEnvironment: "node"
};

