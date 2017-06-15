import * as chai from 'chai';

import { AccessRights, Connection, Protocol, User } from './../../../src';
import { UpdateUserRequest } from './../../../src/user-accounts/request-response/UpdateUserRequest';

chai.should();

describe('update user request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when updating to viewer access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Viewer, false);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=viewer`);
        });

        it('should return URL when updating to viewer access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Viewer, true);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=viewer:ptz`);
        });

        it('should return URL when updating to operator access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Operator, false);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=operator:viewer`);
        });

        it('should return URL when updating to operator access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Operator, true);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=operator:viewer:ptz`);
        });

        it('should return URL when updating to administrator access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Administrator, false);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=admin:operator:viewer`);
        });

        it('should return URL when updating to administrator access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Administrator, true);

            // Act
            const request = new UpdateUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=update&user=${user.name}&pwd=${user.password}&grp=users&sgrp=admin:operator:viewer:ptz`);
        });
    });
});
