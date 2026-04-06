export const MockArgon2 = {
    hash(password: string, options?: { secret?: Buffer }): Promise<string> {
        const pepper = options?.secret?.toString() ?? '';
        return Promise.resolve(`$argon2id$mock:${pepper}:${password}`);
    },
    verify(hash: string, password: string, options?: { secret?: Buffer }): Promise<boolean> {
        const pepper = options?.secret?.toString() ?? '';
        return Promise.resolve(hash === `$argon2id$mock:${pepper}:${password}`);
    },
};
