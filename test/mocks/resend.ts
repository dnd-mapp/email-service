export class MockResendService {
    public readonly send = vi.fn().mockResolvedValue(undefined);
}
