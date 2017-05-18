import { expect } from 'chai';

import { Connection, Protocol } from './../../../src';
import { RemoveUserRequest } from './../../../src/user-accounts/request-response/RemoveUserRequest';

describe('Remove user request', () => {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', () => {

        it('should return URL when removing user', () => {
            // Arrange
            const username = 'John';

            // Act
            const request = new RemoveUserRequest(connection, username);

            // Assert
            expect(request.url).to.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=remove&user=${username}`);
        })
    });
});
