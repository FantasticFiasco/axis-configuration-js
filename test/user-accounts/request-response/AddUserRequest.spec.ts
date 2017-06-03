import * as chai from 'chai';

import { AccessRights, Connection, Protocol, User } from './../../../src';
import { AddUserRequest } from './../../../src/user-accounts/request-response/AddUserRequest';

chai.should();

describe('add user request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when adding user with viewer access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Viewer, false);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=viewer&comment=${user.name}`);
        });

        it('should return URL when adding user with viewer access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Viewer, true);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=viewer:ptz&comment=${user.name}`);
        });

        it('should return URL when adding user with operator access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Operator, false);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=operator:viewer&comment=${user.name}`);
        });

        it('should return URL when adding user with operator access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Operator, true);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=operator:viewer:ptz&comment=${user.name}`);
        });

        it('should return URL when adding user with administrator access', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Administrator, false);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=admin:operator:viewer&comment=${user.name}`);
        });

        it('should return URL when adding user with administrator access and PTZ control', function() {
            // Arrange
            const user = new User('John', 'password', AccessRights.Administrator, true);

            // Act
            const request = new AddUserRequest(connection, user);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/pwdgrp.cgi?action=add&user=${user.name}&pwd=${user.password}&grp=users&sgrp=admin:operator:viewer:ptz&comment=${user.name}`);
        });
    });
});
