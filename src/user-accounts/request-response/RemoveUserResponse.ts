import { UnknownError } from './../..';
import { Response } from './Response';

export class RemoveUserResponse extends Response {
    private static readonly SuccessResponse = /Removed account .*\./;

    constructor(response: string) {
        super(response);
    }

    public assertSuccess() {
        const body = this.html('body').html();

        this.handleUnknownError(body);
    }

    private handleUnknownError(body: string) {
        if (!RemoveUserResponse.SuccessResponse.test(body)) {
            throw new UnknownError(body);
        }
    }
}
