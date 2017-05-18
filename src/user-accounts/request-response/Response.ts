import * as cheerio from 'cheerio';

export abstract class Response {
    private readonly internalHtml: CheerioStatic;

    protected constructor(protected readonly response: string) {
        this.internalHtml = cheerio.load(response);
    }

    protected get html(): CheerioStatic {
        return this.internalHtml;
    }

    public abstract assertSuccess();
}
