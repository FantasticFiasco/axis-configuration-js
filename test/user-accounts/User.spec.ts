import { expect } from 'chai';

import { AccessRights, User } from './../../src';
import { ExpectationError } from './../../src/shared/expectations/ExpectationError';
import { Generate } from './Generate';

describe('Users', () => {

    describe('#ctor(name, ...)', () => {

        it('should throw exception if to short', () => {
            // Act
            const fn = () => new User(Generate.string(0), 'secret', AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });

        it('should throw exception if to long', () => {
            // Act
            const fn = () => new User(Generate.string(15), 'secret', AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });

        it('should throw exception if containing unsupported characters', () => {
            // Act
            const fn = () => new User('Joe-', 'secret', AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });
    });

    describe('#ctor(..., password, ...)', () => {

        it('should throw exception if to short', () => {
            // Act
            const fn = () => new User('Joe', Generate.string(0), AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });

        it('should throw exception if to long', () => {
            // Act
            const fn = () => new User('Joe', Generate.string(65), AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });

        it('should throw exception if containing unsupported characters', () => {
            // Act
            const fn = () => new User('Joe', `secret-${String.fromCharCode(31)}`, AccessRights.Viewer, false);

            // Assert
            expect(fn).to.throw(ExpectationError);
        });
    });
});
