import { Test } from '@nestjs/testing';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            providers: [TemplateService],
        }).compile();

        module.useLogger(false);
        await module.init();

        return { service: module.get(TemplateService) };
    }

    describe('render()', () => {
        it('should compile a Handlebars template and return html', async () => {
            const { service } = await setupTest();

            const { html } = service.render('<p>Hello {{username}}</p>', { username: 'Alice' });

            expect(html).toBe('<p>Hello Alice</p>');
        });

        it('should render missing variables as empty strings', async () => {
            const { service } = await setupTest();

            const { html } = service.render('<p>Hello {{username}}</p>', {});

            expect(html).not.toContain('{{username}}');
        });

        it('should interpolate multiple variables', async () => {
            const { service } = await setupTest();

            const { html } = service.render(
                '<a href="{{link}}">Hello {{username}}</a>',
                { username: 'Bob', link: 'https://example.com' },
            );

            expect(html).toContain('Bob');
            expect(html).toContain('https://example.com');
        });
    });
});
