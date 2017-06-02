import { Expect } from './../shared/expectations/Expect';
import { AccessRights } from './AccessRights';

/**
 * Class describing a user.
 */
export class User {
    constructor(
        /**
         * The user account name (1-14 characters). Valid characters are a-z, A-Z and 0-9.
         */
        readonly name: string,
        /**
         * The unencrypted password (1-64 characters) for the account. ASCII characters from
         * character code 32 to 126 are valid.
         */
        readonly password: string | undefined,
        /**
         * The access rights for the user.
         */
        readonly accessRights: AccessRights,
        /**
         * Whether user has access rights for PTZ control.
         */
        readonly ptz: boolean) {

        // Valdate name
        Expect.toBeOfLength(name, 1, 14, 'User name must be between 1-14 characters.');
        Expect.toBeAlphanumeric(name, 'User name must only contain the characters a-z, A-Z and 0-9.');

        // Validate password
        if (password !== undefined) {
            Expect.toBeOfLength(password as string, 1, 64, 'Password must be between 1-64 characters.');
            Expect.toBeAsciiCharacters(password as string, 32, 126, 'Password must only contain ASCII characters between 32 and 126');
        }
    }
}
