import * as chai from 'chai';

import { Connection, Protocol } from './../../../src';
import { GetParametersRequest } from './../../../src/parameters/request-response/GetParametersRequest';

chai.should();

describe('get parameters request', function() {

    const connection = new Connection(Protocol.Http, '1.2.3.4', 80, 'root', 'pass');

    describe('#url', function() {

        it('should return URL when getting all parameters', function() {
            // Act
            const request = new GetParametersRequest(connection);

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&responseformat=rfc`);
        });

        it('should return URL when getting single parameter', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network.UPnP.FriendlyName');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network.UPnP.FriendlyName&responseformat=rfc`);
        });

        it('should return URL when getting multiple parameters', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network.UPnP.FriendlyName', 'Properties.API.HTTP.Version');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network.UPnP.FriendlyName,Properties.API.HTTP.Version&responseformat=rfc`);
        });

        it('should return URL when getting single group', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network&responseformat=rfc`);
        });

        it('should return URL when getting multiple groups', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network', 'Properties');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network,Properties&responseformat=rfc`);
        });

        it('should return URL when getting single group with wildcard', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network.*.FriendlyName');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network.*.FriendlyName&responseformat=rfc`);
        });

        it('should return URL when getting multiple groups with wildcards', function() {
            // Act
            const request = new GetParametersRequest(connection, 'Network.*.FriendlyName', 'Properties.API.*.Version');

            // Assert
            request.url.should.equal(`${connection.url}/axis-cgi/param.cgi?action=list&group=Network.*.FriendlyName,Properties.API.*.Version&responseformat=rfc`);
        });
    });
});
