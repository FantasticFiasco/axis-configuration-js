import { ExpectationError } from '@fantasticfiasco/expect';

import { AccessRights } from './../..';

export class Converter {

    public static toUserGroups(accessRights: AccessRights, ptz: boolean): string {
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
}
