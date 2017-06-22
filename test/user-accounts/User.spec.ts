import * as chai from 'chai';
import { ExpectationError } from '@fantasticfiasco/expect';

import { AccessRights, User } from './../../src';
import { Generate } from './Generate';

chai.should();

describe('users', function() {

    describe('#ctor(name, ...)', function() {

        it('should throw exception if to short', function() {
            // Act
            const fn = () => new User(Generate.string(0), 'secret', AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });

        it('should throw exception if to long', function() {
            // Act
            const fn = () => new User(Generate.string(15), 'secret', AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });

        it('should throw exception if containing unsupported characters', function() {
            // Act
            const fn = () => new User('Joe-', 'secret', AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });
    });

    describe('#ctor(..., password, ...)', function() {

        it('should throw exception if to short', function() {
            // Act
            const fn = () => new User('Joe', Generate.string(0), AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });

        it('should throw exception if to long', function() {
            // Act
            const fn = () => new User('Joe', Generate.string(65), AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });

        it('should throw exception if containing unsupported characters', function() {
            // Act
            const fn = () => new User('Joe', `secret-${String.fromCharCode(31)}`, AccessRights.Viewer, false);

            // Assert
            fn.should.throw(ExpectationError);
        });
    });
});
