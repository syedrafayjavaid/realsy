import {MemoryTokenStore} from "api/token-store/memory-token-store";

/**
 * @group unit
 */
describe ('Memory Token Store', () => {
    it ('stores a token', async () => {
        const token = 'test-token';
        const store = new MemoryTokenStore();
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + 1);

        await store.setToken(token, expiration);

        expect(await store.getToken()).toEqual(token);
    });

    it ('tracks token expiration', async () => {
        const store = new MemoryTokenStore();
        const expiration = new Date();
        expiration.setDate(expiration.getDate() - 1);

        await store.setToken('test-token', expiration);

        expect(await store.isTokenExpired()).toBe(true);
    });

    it ('determines token expiration with a given offset', async () => {
        const store = new MemoryTokenStore();
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);

        await store.setToken('test-token', expiration);

        expect(await store.isTokenExpired(60*60)).toBe(true);
    });

    it ('returns null if the token is expired', async () => {
        const store = new MemoryTokenStore();
        const expiration = new Date();
        expiration.setHours(expiration.getHours() - 1);

        await store.setToken('test-token', expiration);

        expect(await store.getToken()).toBeNull();
    })
});
