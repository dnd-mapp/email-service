export interface SendEmail {
    to: string;
    templateName: string;
    variables?: Record<string, string>;
}
