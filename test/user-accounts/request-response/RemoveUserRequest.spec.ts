import * as chai from 'chai';

import { Connection, Protocol } from './../../../src';
import { RemoveUserRequest } from './../../../src/user-accounts/request-response/RemoveUserRequest';

chai.should();

describe('remove user request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when removing user', function() {
            // Arrange
            const username = 'John';

            // Act
            const request = new RemoveUserRequest(connection, username);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=remove&user=${username}`);
        })
    });
});
