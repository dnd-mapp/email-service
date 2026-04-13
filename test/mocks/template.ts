export class MockTemplateService {
    public readonly render = vi.fn().mockReturnValue({
        subject: 'Mock Subject',
        html: '<p>Mock HTML</p>',
    });
}
