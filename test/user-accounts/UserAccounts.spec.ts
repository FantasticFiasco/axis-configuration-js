import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as nock from 'nock';

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
import { ExpectationError } from './../../src/shared/expectations/ExpectationError';
import { Generate } from './Generate';
import { GetUsersResponseBuilder } from './request-response/GetUsersResponseBuilder';

chai.use(chaiAsPromised);

describe('Users', () => {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');
    const userAccounts = new UserAccounts(connection);

    afterEach(() => {
        nock.cleanAll();
    });

    describe('#add', () => {
        it('should add user with viewer access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should add user with viewer and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should add user with operator access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should add user with operator and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should add user with administrator access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should add user with administrator and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html(`Created account ${user.name}.`));

            // Act
            await userAccounts.add(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should throw exception if password is omitted', () => {
            // Arrange
            const user = new User('Joe', undefined, AccessRights.Viewer, false);

            // Act
            const fn = () => userAccounts.add(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(ExpectationError);
        });

        it('should throw exception if user already exists', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(200, Generate.html('Error: this user name already exists, consult the system log file'));

            // Act
            const fn = () => userAccounts.add(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UserAlreadyExistsError);
        });

        it('should throw exception if device is unresponsive', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            // Act
            const fn = () => userAccounts.add(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(RequestError);
        });

        it('should throw exception if user is unauthorized', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=add/)
                .reply(401);

            // Act
            const fn = () => userAccounts.add(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnauthorizationError);
        });
    });

    describe('#getAll', () => {

        let responseBuilder: GetUsersResponseBuilder;

        beforeEach(() => {
            responseBuilder = new GetUsersResponseBuilder();
        });

        it('should get user with viewer access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Viewer);
            expect(users[0].ptz).to.be.false;
        });

        it('should get user with viewer and PTZ access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Viewer, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Viewer);
            expect(users[0].ptz).to.be.true;
        });

        it('should get user with operator access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Operator, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Operator);
            expect(users[0].ptz).to.be.false;
        });

        it('should get user with operator and PTZ access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Operator, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Operator);
            expect(users[0].ptz).to.be.true;
        });

        it('should get user with administrator access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Administrator, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Administrator);
            expect(users[0].ptz).to.be.false;
        });

        it('should get user with administrator and PTZ access', async () => {
            // Arrange
            responseBuilder.addUser('Joe', AccessRights.Administrator, true);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(200, responseBuilder.build());

            // Act
            const users = await userAccounts.getAll();

            // Assert
            expect(users.length).to.equal(1);
            expect(users[0].name).to.equal('Joe');
            expect(users[0].accessRights).to.equal(AccessRights.Administrator);
            expect(users[0].ptz).to.be.true;
        });

        it('should get users', async () => {
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
            expect(users.length).to.equal(3);

            expect(users[0].name).to.equal('Jane');
            expect(users[0].accessRights).to.equal(AccessRights.Administrator);
            expect(users[0].ptz).to.be.true;

            expect(users[1].name).to.equal('Franck');
            expect(users[1].accessRights).to.equal(AccessRights.Operator);
            expect(users[1].ptz).to.be.false;

            expect(users[2].name).to.equal('Joe');
            expect(users[2].accessRights).to.equal(AccessRights.Viewer);
            expect(users[2].ptz).to.be.true;
        });

        it('should throw exception if device is unresponsive', () => {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            // Act
            const fn = () => userAccounts.getAll();

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(RequestError);
        });

        it('should throw exception if user is unauthorized', () => {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=get/)
                .reply(401);

            // Act
            const fn = () => userAccounts.getAll();

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnauthorizationError);
        });
    });

    describe('#update', () => {
        it('should update user with viewer access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should update user with viewer and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should update user with operator access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should update user with operator and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Operator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should update user with administrator access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, false);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should update user with administrator and PTZ access', async () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Administrator, true);

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html(`Modified account ${user.name}.`));

            // Act
            await userAccounts.update(user);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should throw exception if user does not exist', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(200, Generate.html('Error: consult the system log file.'));

            // Act
            const fn = () => userAccounts.update(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnknownError);
        });

        it('should throw exception if device is unresponsive', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            // Act
            const fn = () => userAccounts.update(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(RequestError);
        });

        it('should throw exception if user is unauthorized', () => {
            // Arrange
            const user = new User('Joe', 'secret', AccessRights.Viewer, false);

            nock(connection.url)
                .get(/pwdgrp.cgi\?action=update/)
                .reply(401);

            // Act
            const fn = () => userAccounts.update(user);

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnauthorizationError);
        });
    });

    describe('#remove', () => {
        it('should remove user', async () => {
            // Arrange
            const username = 'Joe';

            const scope = nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(200, Generate.html(`Removed account ${username}.`));

            // Act
            await userAccounts.remove(username);

            // Assert
            expect(scope.isDone()).to.be.true;
        });

        it('should throw exception if user does not exist', () => {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(200, Generate.html('Error: consult the system log file.'));

            // Act
            const fn = () => userAccounts.remove('Joe');

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnknownError);
        });

        it('should throw exception if device is unresponsive', () => {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            // Act
            const fn = () => userAccounts.remove('Joe');

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(RequestError);
        });

        it('should throw exception if user is unauthorized', () => {
            // Arrange
            nock(connection.url)
                .get(/pwdgrp.cgi\?action=remove/)
                .reply(401);

            // Act
            const fn = () => userAccounts.remove('Joe');

            // Assert
            return expect(fn()).to.eventually.be.rejectedWith(UnauthorizationError);
        });
    });
});
