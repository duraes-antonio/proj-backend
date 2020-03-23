module.exports = {
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-sonar-reporter",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  verbose: true,
  modulePaths: [
    "<rootDir>"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
