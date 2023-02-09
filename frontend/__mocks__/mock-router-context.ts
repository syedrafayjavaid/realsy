import {NextRouter} from "next/router";

/**
 * Mock NextJS router context provider value
 * Needed for tests with components that interact with the router
 */
export const mockRouterContext = (overrides: Partial<NextRouter> = {}) => {
    const defaults: NextRouter = {
        basePath: '/',
        pathname: '/',
        route: '/',
        query: {},
        asPath: '/',
        push: jest.fn(() => Promise.resolve(true)),
        replace: jest.fn(() => Promise.resolve(true)),
        reload: jest.fn(() => Promise.resolve(true)),
        prefetch: jest.fn(() => Promise.resolve()),
        back: jest.fn(() => Promise.resolve(true)),
        beforePopState: jest.fn(() => Promise.resolve(true)),
        isFallback: false,
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
    };

    return {
        ...defaults,
        ...overrides,
    };
};
