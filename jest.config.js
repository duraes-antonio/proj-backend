module.exports = {
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-sonar-reporter",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  verbose: false,
  modulePaths: [
    "<rootDir>"
  ],
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
