module.exports = {
  coverageDirectory: "coverage",
  testResultsProcessor: "jest-sonar-reporter",
  testEnvironment: "node",
  moduleDirectories: [
    "node_modules"
  ],
  transform: {
    "\\.tsx?$": "ts-jest",
    "\\.jsx?$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      "tsConfig": "<rootDir>/tsconfig.json",
      diagnostics: false
    }
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\](?!lodash-es/).+\\.js$"
  ]
};
