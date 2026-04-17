import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class TemplateService {
    public render(content: string, variables: Record<string, string>): { html: string } {
        const compiled = Handlebars.compile(content);

        return { html: compiled(variables) };
    }
}
