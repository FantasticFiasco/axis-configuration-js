import * as chai from 'chai';

import { Connection, Protocol } from './../../../src';
import { UpdateParametersRequest } from './../../../src/parameters/request-response/UpdateParametersRequest';

chai.should();

describe('update parameters request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when updating single parameter', function() {
            // Arrange
            const parameters = {
                'Network.Bonjour.FriendlyName': 'Lobby'
            };

            // Act
            const request = new UpdateParametersRequest(connection, parameters);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=update&Network.Bonjour.FriendlyName=Lobby`);
        });

        it('should return URL when updating multiple parameters', function() {
            // Arrange
            const parameters = {
                'Network.Bonjour.FriendlyName': 'Lobby',
                'Network.UPnP.FriendlyName': 'Lobby'
            };

            // Act
            const request = new UpdateParametersRequest(connection, parameters);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=update&Network.Bonjour.FriendlyName=Lobby&Network.UPnP.FriendlyName=Lobby`);
        });
    });
});
