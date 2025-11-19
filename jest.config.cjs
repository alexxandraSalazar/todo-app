/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js',
        '^@/lib/env$': '<rootDir>/src/test/__mocks__/envMock.ts',
        '^@/(.*)$': '<rootDir>/src/$1',
        '.*lib/env$': '<rootDir>/src/test/__mocks__/envMock.ts',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true,
            tsconfig: {
                verbatimModuleSyntax: false,
                esModuleInterop: true,
                module: 'commonjs',
                jsx: 'react-jsx',
                baseUrl: '.',
                paths: {
                    '@/*': ['./src/*']
                }
            },
        }],
    },
};