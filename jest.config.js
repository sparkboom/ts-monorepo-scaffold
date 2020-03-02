const { resolve } = require('path');

module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',

  // Module Matching
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: [
    '<rootDir>/packages/app/src',
    '<rootDir>/packages/ux/src',
    '<rootDir>/packages/shared',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)spec)\\.tsx?$',

  // TS-Jest
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/config/jest-setup-transform.js',
  },

  // Coverage report
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 60,
      statements: 60
    },
  },
  collectCoverageFrom: [
    '<rootDir>/packages/app/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/packages/ux/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/packages/ux/**/*.stories.tsx',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/packages/api/', '/__fixtures__/'],
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coverageDirectory: 'reports/coverage',

  // Map modules
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css': '<rootDir>/packages/shared/__mocks__/styleMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/packages/shared/__mocks__/fileMock.js'
  },

  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [
    '<rootDir>/config/jest-setup.tsx'
  ],
  setupFilesAfterEnv: [
    'jest-extended',
    '<rootDir>/config/jest-setup-postenv.ts'
  ],
  // transformIgnorePatterns: [
  //   '/!node_modules\\/lodash-es/'
  // ]
};
