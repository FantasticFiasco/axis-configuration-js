import * as rp from 'request-promise-native';
import * as errors from 'request-promise-native/errors';

import { AccessRights, Connection, RequestError, UnauthorizationError } from './../..';
import { ExpectationError } from './../../shared/expectations/ExpectationError';

export abstract class Request {

    protected constructor(protected readonly connection: Connection) {
    }

    protected async get(url): Promise<string> {
        const options: rp.RequestPromiseOptions = {
            auth: {
                user: this.connection.username,
                pass: this.connection.password,
                sendImmediately: false,
            },
        };

        try {
            return await rp.get(url, options);
        } catch (error) {
            this.handleStatusCodeError(error);
            this.handleRequestError(error);

            // Fallback
            throw error;
        }
    }

    protected toUserGroups(accessRights: AccessRights, ptz: boolean): string {
        const userGroups: string[] = [];

        switch (accessRights) {
            case AccessRights.Administrator:
                userGroups.push('admin');

            case AccessRights.Operator:
                userGroups.push('operator');

            case AccessRights.Viewer:
                userGroups.push('viewer');
                break;

            default:
                throw new ExpectationError(`Unsupported access right: ${accessRights}`);
        }

        if (ptz) {
            userGroups.push('ptz');
        }

        return userGroups.join(':');
    }

    private handleStatusCodeError(error) {
        if (error instanceof errors.StatusCodeError) {
            if (error.statusCode === 401) {
                throw new UnauthorizationError();
            }

            throw new RequestError(error.message, error.statusCode, undefined, error.error, error.response);
        }
    }

    private handleRequestError(error: errors.RequestError) {
        if (error instanceof errors.RequestError) {
            throw new RequestError(error.message, undefined, error.cause, error.error, error.response);
        }
    }
}
