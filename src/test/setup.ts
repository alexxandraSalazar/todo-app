import '@testing-library/jest-dom';

const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => store[key] || null),

        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),

        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),

        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});