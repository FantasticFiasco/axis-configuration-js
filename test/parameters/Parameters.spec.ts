import * as chai from 'chai';
import * as nock from 'nock';

import {
    Connection,
    Parameters,
    Protocol,
    RequestError,
    UnauthorizationError,
    UpdateParametersError } from './../../src';
import { ExpectationError } from './../../src/shared/expectations/ExpectationError';

const should = chai.should();

describe('parameters', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');
    const parameters = new Parameters(connection);

    afterEach('after each parameter test', function() {
        nock.cleanAll();
    });

    describe('#get', function() {
        it('should get single parameter', async function() {
            // Arrange
            const name = 'Network.Bonjour.FriendlyName';
            const value = 'Main Entrance';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, `root.${name}=${value}`);

            // Act
            const root = await parameters.get(name);

            // Assert
            root[name].should.equal(value);
        });

        it('should get multiple parameters', async function() {
            // Arrange
            const name1 = 'Network.Bonjour.FriendlyName';
            const value1 = 'Main Entrance';
            const name2 = 'Network.Bonjour.Enabled';
            const value2 = 'yes';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, `root.${name1}=${value1}\r\nroot.${name2}=${value2}`);

            // Act
            const root = await parameters.get(name1, name2);

            // Assert
            root[name1].should.equal(value1);
            root[name2].should.equal(value2);
        });

        it('should trim single parameter', async function() {
            // Arrange
            const name = 'Network.Bonjour.FriendlyName';
            const value = 'Main Entrance';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, ` root.${name} = ${value} `);

            // Act
            const root = await parameters.get(name);

            // Assert
            root[name].should.equal(value);
        });

        it('should trim multiple parameters', async function() {
            // Arrange
            const name1 = 'Network.Bonjour.FriendlyName';
            const value1 = 'Main Entrance';
            const name2 = 'Network.Bonjour.Enabled';
            const value2 = 'yes';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, ` root.${name1} = ${value1} \r\n root.${name2} = ${value2} `);

            // Act
            const root = await parameters.get(name1, name2);

            // Assert
            root[name1].should.equal(value1);
            root[name2].should.equal(value2);
        });

        it('should not get single unknown parameter', async function() {
            // Arrange
            const name = 'Unknown.Parameter';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, `# Error: Error -1 getting param in group '${name}'\r\n`);

            // Act
            const root = await parameters.get(name);

            // Assert
            should.not.exist(root[name]);
        });

        it('should not get multiple unknown parameters', async function() {
            // Arrange
            const name1 = 'Unknown.Parameter1';
            const name2 = 'Unknown.Parameter2';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, `# Error: Error -1 getting param in group '${name1}'\r\n# Error: Error -1 getting param in group '${name2}'\r\n`);

            // Act
            const root = await parameters.get(name1, name2);

            // Assert
            should.not.exist(root[name1]);
            should.not.exist(root[name2]);
        });

        it('should get a mixture of known and unknown parameters', async function() {
            // Arrange
            const name1 = 'Network.Bonjour.FriendlyName';
            const value1 = 'Main Entrance';
            const name2 = 'Unknown.Parameter';

            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(200, `root.${name1}=${value1}\r\n# Error: Error -1 getting param in group '${name2}'\r\n`);

            // Act
            const root = await parameters.get(name1, name2);

            // Assert
            root[name1].should.equal(value1);
            should.not.exist(root[name2]);
        });

        it('should throw exception if no parameter is specified', async function() {
            try {
                // Act
                await parameters.get();
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(ExpectationError);
            }
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await parameters.get('Network.Bonjour.FriendlyName');
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            nock(connection.url)
                .get(/param.cgi\?action=list/)
                .reply(401);

            try {
                // Act
                await parameters.get('Network.Bonjour.FriendlyName');
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });

    describe('#update', function() {
        it('should update single parameter', async function() {
            // Arrange
            const scope = nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(200, 'OK');

            // Act
            await parameters.update({'Network.Bonjour.FriendlyName': 'Main Entrance'});

            // Assert
            scope.isDone().should.be.true;
        });

        it('should update multiple parameters', async function() {
            // Arrange
            const scope = nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(200, 'OK');

            // Act
            await parameters.update({
                'Network.Bonjour.FriendlyName': 'Main Entrance',
                'Network.Bonjour.Enabled': 'yes'
            });

            // Assert
            scope.isDone().should.be.true;
        });

        it('should not update single unknown parameter', async function() {
            // Arrange
            const name = 'Unknown.Parameter';
            const value = 'Value';

            nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(200, `# Error: Error setting '${name}' to '${value}'!\r\n`);

            try {
                // Act
                await parameters.update({ [name]: value });
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.instanceof(UpdateParametersError);
                error.parameterNames.should.deep.equal([ name ]);
            }
        });

        it('should not update multiple unknown parameters', async function() {
            // Arrange
            const name1 = 'Unknown.Parameter1';
            const value1 = 'Value1';
            const name2 = 'Unknown.Parameter2';
            const value2 = 'Value2';

            nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(200, `# Error: Error setting '${name1}' to '${value1}'!\r\n# Error: Error setting '${name2}' to '${value2}'!\r\n`);

            try {
                // Act
                await parameters.update({ [name1]: value1, [name2]: value2 });
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.instanceof(UpdateParametersError);
                error.parameterNames.should.deep.equal([ name1, name2 ]);
            }
        });

        it('should update a mixture of known and unknown parameters', async function() {
            // Arrange
            const name = 'Unknown.Parameter';
            const value = 'Value';

            nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(200, `# Error: Error setting '${name}' to '${value}'!\r\n`);

            try {
                // Act
                await parameters.update({ 'Network.Bonjour.FriendlyName': 'Main Entrance', name: value });
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.instanceof(UpdateParametersError);
                error.parameterNames.should.deep.equal([ name ]);
            }
        });

        it('should throw exception if no parameters are specified', async function() {
            try {
                // Act
                await parameters.update({});
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.instanceof(ExpectationError);
            }
        });

        it('should throw exception if device is unresponsive', async function() {
            // Arrange
            nock(connection.url)
                .get(/param.cgi\?action=update/)
                .replyWithError(`Error: connect ETIMEDOUT ${connection.address}:${connection.port}`);

            try {
                // Act
                await parameters.update({ 'Network.Bonjour.FriendlyName': 'Main Entrance' });
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(RequestError);
            }
        });

        it('should throw exception if user is unauthorized', async function() {
            // Arrange
            nock(connection.url)
                .get(/param.cgi\?action=update/)
                .reply(401);

            try {
                // Act
                await parameters.update({ 'Network.Bonjour.FriendlyName': 'Main Entrance' });
                throw new Error('This exception should not be thrown');
            } catch (error) {
                // Assert
                error.should.be.instanceof(UnauthorizationError);
            }
        });
    });
});
