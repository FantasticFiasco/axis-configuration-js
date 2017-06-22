import * as chai from 'chai';
import * as nock from 'nock';
import { ExpectationError } from '@fantasticfiasco/expect';

import {
    AccessRights,
    Connection,
    RequestError,
    Protocol,
    User,
    UnauthorizationError,
    UnknownError,
    UserAccounts,
    UserAlreadyExistsError } from './../../src';
import { Generate } from './Generate';
import { GetUsersResponseBuilder } from './request-response/GetUsersResponseBuilder';

chai.should();

describe('users', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');
    const userAccounts = new UserAccounts(connection);

    afterEach('after each user test', function() {
        nock.cleanAll();
    });

    describe('#add', function() {
        it('should add user with viewer access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should add user with viewer and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should add user with operator access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should add user with operator and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should add user with administrator access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should add user with administrator and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            scope.isDone().should.to.be.true;
        });

        it('should throw exception if password is omitted', async function() {
            // Arrange
            const user = new User('Joe', undefined, AccessRights.Viewer, false);

            try {
                // Act
                await userAccounts.add(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(ExpectationError);
            }
        });

        it('should throw exception if user already exists', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html('Error: this user name already exists, consult the system log file'));

            try {
                // Act
                await userAccounts.add(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UserAlreadyExistsError);
            }
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await userAccounts.add(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(401);

            try {
                // Act
                await userAccounts.add(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });

    describe('#getAll', function() {

        let responseBuilder: GetUsersResponseBuilder;

        beforeEach('before each #getAll test', function() {
            responseBuilder = new GetUsersResponseBuilder();
        });

        it('should get user with viewer access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Viewer);
            users[0].ptz.should.be.false;
        });

        it('should get user with viewer and PTZ access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Viewer, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Viewer);
            users[0].ptz.should.be.true;
        });

        it('should get user with operator access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Operator, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Operator);
            users[0].ptz.should.be.false;
        });

        it('should get user with operator and PTZ access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Operator, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Operator);
            users[0].ptz.should.be.true;
        });

        it('should get user with administrator access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Administrator, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Administrator);
            users[0].ptz.should.be.false;
        });

        it('should get user with administrator and PTZ access', async function() {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Administrator, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(1);
            users[0].name.should.equal('Joe');
            users[0].accessRights.should.equal(AccessRights.Administrator);
            users[0].ptz.should.be.true;
        });

        it('should get users', async function() {
            // Arrange
            responseBuilder.addUser('Jane', AccessRights.Administrator, true);
            responseBuilder.addUser('Franck', AccessRights.Operator, false);
            responseBuilder.addUser('Joe', AccessRights.Viewer, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            users.length.should.equal(3);

            users[0].name.should.equal('Jane');
            users[0].accessRights.should.equal(AccessRights.Administrator);
            users[0].ptz.should.be.true;

            users[1].name.should.equal('Franck');
            users[1].accessRights.should.equal(AccessRights.Operator);
            users[1].ptz.should.be.false;

            users[2].name.should.equal('Joe');
            users[2].accessRights.should.equal(AccessRights.Viewer);
            users[2].ptz.should.be.true;
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await userAccounts.getAll();
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(401);

            try {
                // Act
                await userAccounts.getAll();
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });

    describe('#update', function() {
        it('should update user with viewer access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update user with viewer and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update user with operator access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update user with operator and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update user with administrator access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update user with administrator and PTZ access', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should throw exception if user does not exist', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html('Error: consult the system log file.'));

            try {
                // Act
                await userAccounts.update(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnknownError);
            }
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await userAccounts.update(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(401);

            try {
                // Act
                await userAccounts.update(user);
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });

    describe('#remove', function() {
        it('should remove user', async function() {
            // Arrange
            const username = 'Joe';

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(200, Generate.html(`Removed account ${username}.`));

            // Act
            await userAccounts.remove(username);

            // Assert
            scope.isDone().should.be.true;
        });

        it('should throw exception if user does not exist', async function() {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(200, Generate.html('Error: consult the system log file.'));

            try {
                // Act
                await userAccounts.remove('Joe');
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnknownError);
            }
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await userAccounts.remove('Joe');
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(401);

            try {
                // Act
                await userAccounts.remove('Joe');
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });
});
