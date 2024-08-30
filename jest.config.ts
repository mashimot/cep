


import type { Config } from 'jest';

const config: Config = {
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
    coveragePathIgnorePatterns: [
        "node_modules",
        "test-config",
        "interfaces",
        "jestGlobalMocks.ts",
        ".module.ts",
        "<rootDir>/src/main.ts",
        ".mock.ts"
    ],
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    globalSetup: 'jest-preset-angular/global-setup',
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/"
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
    transform: {
        '^.+\\.(ts|js|html)$': ['jest-preset-angular', {
            tsConfig: "<rootDir>/tsconfig.spec.json",
            stringifyContentPathRegex: "\\.html$"
        }]
    },
};

export default config;