import * as chai from 'chai';

import { Connection, Protocol } from './../../../src';
import { GetUsersRequest } from './../../../src/user-accounts/request-response/GetUsersRequest';

chai.should();

describe('get users request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when getting all users', function() {
            // Act
            const request = new GetUsersRequest(connection);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=get`);
        });
    });
});
