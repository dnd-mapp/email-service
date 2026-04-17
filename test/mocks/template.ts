export class MockTemplateService {
    public readonly render = vi.fn().mockReturnValue({
        html: '<p>Mock HTML</p>',
    });
}
