import * as cv from 'class-validator';

import { ExpectationError } from './ExpectationError';

export class Expect {
    private static readonly validator = new cv.Validator();

    /**
     * Validates that a string only contain letters and numbers.
     */
    public static toBeAlphanumeric(value: string, errorMessage: string) {
        if (!this.validator.isAlphanumeric(value)) {
            throw new ExpectationError(errorMessage);
        }
    }

    /**
     * Validates that a string only contains characters from a range of character codes.
     */
    public static toBeAsciiCharacters(value: string, minCharacterCode: number, maxCharacterCode: number, errorMessage: string) {
        for (let index = 0; index < value.length; index++) {
            const char = value.charCodeAt(index);

            if (char < minCharacterCode || char > maxCharacterCode) {
                throw new ExpectationError(errorMessage);
            }
        }
    }

    /**
     * Validates that a string is of a certain length.
     */
    public static toBeOfLength(value: string, min: number, max: number, errorMessage: string) {
        if (!this.validator.length(value, min, max)) {
            throw new ExpectationError(errorMessage);
        }
    }

    /**
     * Validates that a string is defined.
     */
    public static toBeDefined(value: string | undefined, errorMessage: string) {
        if (!value) {
            throw new ExpectationError(errorMessage);
        }
    }
}
