module.exports = {
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-sonar-reporter",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  verbose: false,
  modulePaths: [
    "<rootDir>"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
