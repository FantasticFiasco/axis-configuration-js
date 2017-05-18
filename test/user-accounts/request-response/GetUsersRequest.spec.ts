import { expect } from 'chai';

import { Connection, Protocol } from './../../../src';
import { GetUsersRequest } from './../../../src/user-accounts/request-response/GetUsersRequest';

describe('Get users request', () => {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', () => {

        it('should return URL when getting all users', () => {
            // Act
            const request = new GetUsersRequest(connection);

            // Assert
            expect(request.url).to.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=get`);
        });
    });
});
