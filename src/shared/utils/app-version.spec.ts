import { appVersion } from './app-version';

describe('appVersion', () => {
    it('should return the version of the app', async () => {
        expect(await appVersion()).toEqual(expect.any(String));
    });

    it.skip('should only read and parse once', async () => {
        const spy = vi.spyOn(JSON, 'parse');

        await appVersion();
        await appVersion();
        await appVersion();

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
