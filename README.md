# axis-configuration

[![Build Status](https://travis-ci.org/FantasticFiasco/axis-configuration.svg?branch=master)](https://travis-ci.org/FantasticFiasco/axis-configuration)
[![Coverage Status](https://coveralls.io/repos/github/FantasticFiasco/axis-configuration/badge.svg)](https://coveralls.io/github/FantasticFiasco/axis-configuration)
[![npm version](https://img.shields.io/npm/v/axis-configuration.svg)](https://www.npmjs.com/package/axis-configuration)
[![Greenkeeper badge](https://badges.greenkeeper.io/FantasticFiasco/axis-configuration.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/FantasticFiasco/axis-configuration/status.svg)](https://david-dm.org/FantasticFiasco/axis-configuration)
[![devDependencies Status](https://david-dm.org/FantasticFiasco/axis-configuration/dev-status.svg)](https://david-dm.org/FantasticFiasco/axis-configuration?type=dev)

A Node.js library written in TypeScript capable of configuring [Axis Communication](http://www.axis.com) cameras.

## Installation

```sh
npm install axis-configuration
```

## Prerequisites

The library support cameras with the following characteristics:

- __Property__: `Properties.API.HTTP.Version=3`
- __Firmware__: 5.00 and later

## User accounts

### Usage

```javascript
const connection = new Connection(Protocol.Http, '192.168.1.102', 80, 'admin', '32naJzkJdZ!7*HK&Dz');
const userAccounts = new UserAccounts(connection);

// Add user account
const user = new User('John', 'D2fK$xFpBaxtH@RQ5j', AccessRights.Viewer, true);
await userAccounts.add(user);

// Get all user accounts
const users = await userAccounts.getAll();

// Update user account
const promotion = new User(user.name, user.password, AccessRights.Operator, user.ptz);
await userAccounts.update(promotion);

// Remove user account
await userAccounts.remove(user.name);
```

### API

#### UserAccounts

The `UserAccounts` class exposes all user account related operations on the camera. With it you can add, read, update and remove user accounts. Please note that you need an existing user with administrator access rights to carry out these operations.

```javascript
/**
 * Class responsible for adding a new user account with password and group membership, modify the
 * information and remove a user account.
 */
class UserAccounts {
    /**
     * Adds a new user.
     * @throws {UserAlreadyExistsError} User already exists.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    add(user: User): Promise<void>;

    /**
     * Gets all users.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     */
    getAll(): Promise<User[]>;

    /**
     * Updates a user.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    update(user: User): Promise<void>;

    /**
     * Removes a user.
     * @throws {UnauthorizedError} User is not authorized to perform operation.
     * @throws {RequestError} Request failed.
     * @throws {UnknownError} Error cause is unknown.
     */
    remove(username: string): Promise<void>;
}
```

#### User

```javascript
/**
 * Class describing a user.
 */
class User {
    /**
     * The user account name (1-14 characters). Valid characters are a-z, A-Z and 0-9.
     */
    readonly name: string;

    /**
     * The unencrypted password (1-64 characters) for the account. ASCII characters from
     * character code 32 to 126 are valid.
     */
    readonly password: string | undefined;

    /**
     * Colon separated existing secondary group names of the account. This argument sets the
     * user access rights for the user account.
     */
    readonly accessRights: AccessRights;

    /**
     * Whether user has access rights for PTZ control.
     */
    readonly ptz: boolean;
}

```

## Credit

Thank you [JetBrains](https://www.jetbrains.com/) for your important initiative to support the open source community with free licenses to your products.

![JetBrains](./design/jetbrains.png)
