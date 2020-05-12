import * as cheerio from 'cheerio';

export abstract class Response {
    private internalHtml?: CheerioStatic;

    protected constructor(protected readonly response: string) {
    }

    protected get html(): CheerioStatic {
        if (!this.internalHtml) {
            this.internalHtml = cheerio.load(this.response);
        }

        return this.internalHtml;
    }

    public abstract assertSuccess(): void;
}
