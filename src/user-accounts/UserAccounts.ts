import { Connection, User } from './..';
import { Expect } from './../shared/expectations/Expect';
import { AddUserRequest } from './request-response/AddUserRequest';
import { GetUsersRequest } from './request-response/GetUsersRequest';
import { RemoveUserRequest } from './request-response/RemoveUserRequest';
import { UpdateUserRequest } from './request-response/UpdateUserRequest';

/**
 * Class responsible for adding a new user account with password and group membership, modify the
 * information and remove a user account.
 */
export class UserAccounts {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Adds a new user.
     * @throws {UserAlreadyExistsError} User already exists.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    public async add(user: User) {
        Expect.toBeDefined(user.password, 'Password must be specified.');

        const request = new AddUserRequest(this.connection, user);
        const response = await request.send();

        response.assertSuccess();
    }

    /**
     * Gets all users.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     */
    public async getAll(): Promise<User[]> {
        const request = new GetUsersRequest(this.connection);
        const response = await request.send();

        response.assertSuccess();

        return response.users;
    }

    /**
     * Updates a user.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    public async update(user: User) {
        Expect.toBeDefined(user.password, 'Password must be specified.');

        const request = new UpdateUserRequest(this.connection, user);
        const response = await request.send();

        response.assertSuccess();
    }

    /**
     * Removes a user.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    public async remove(username: string) {
        const request = new RemoveUserRequest(this.connection, username);
        const response = await request.send();

        response.assertSuccess();
    }
}
