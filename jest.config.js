module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/main/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['./src/main/**/*.ts'],
  coverageDirectory: '<rootDir>/src/test/javascript/coverage/',
  coveragePathIgnorePatterns: ['<rootDir>/src/main/arch-unit/domain/hexagonal/', '<rootDir>/src/main/main.ts'],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
