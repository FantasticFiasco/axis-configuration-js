import { UnknownError } from './../..';
import { Response } from './Response';

export class UpdateUserResponse extends Response {
    private static readonly SuccessResponse = /Modified account .*\./;

    constructor(response: string) {
        super(response);
    }

    public assertSuccess() {
        const body = this.html('body').html();

        this.handleUnknownError(body);
    }

    private handleUnknownError(body: string) {
        if (!UpdateUserResponse.SuccessResponse.test(body)) {
            throw new UnknownError(body);
        }
    }
}
