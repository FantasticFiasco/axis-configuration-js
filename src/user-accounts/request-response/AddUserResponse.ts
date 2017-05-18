import { UnknownError, UserAlreadyExistsError } from './../..';
import { Response } from './Response';

export class AddUserResponse extends Response {
    private static readonly SuccessResponse = /Created account .*\./;
    private static readonly UserAlreadyExistsResponse = /Error: this user name already exists, consult the system log file/;

    constructor(response: string) {
        super(response);
    }

    public assertSuccess() {
        const body = this.html('body').html();

        this.handleUserAlreadyExistsError(body);
        this.handleUnknownError(body);
    }

    private handleUserAlreadyExistsError(body: string) {
        if  (AddUserResponse.UserAlreadyExistsResponse.test(body)) {
            throw new UserAlreadyExistsError();
        }
    }

    private handleUnknownError(body: string) {
        if (!AddUserResponse.SuccessResponse.test(body)) {
            throw new UnknownError(body);
        }
    }
}
