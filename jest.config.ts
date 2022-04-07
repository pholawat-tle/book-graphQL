module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s?$': 'ts-jest'
  },
  bail: 1,
  testRegex: '\\.test\\.ts',
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  clearMocks: true,
  silent: false,
  verbose: false,
  testTimeout: 30000,
  globalTeardown: '<rootDir>/scripts/globalTeardown.js'
};

