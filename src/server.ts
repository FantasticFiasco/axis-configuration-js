import { AccessRights, Connection, Protocol, User, UserAccounts } from './';

const connection = new Connection(Protocol.Http, '192.168.1.102', 80, 'admin', '32naJzkJdZ!7*HK&Dz');
const userAccounts = new UserAccounts(connection);

// John has viewer access rights and PTZ control
const userToAdd = new User('John', 'D2fK$xFpBaxtH@RQ5j', AccessRights.Viewer, true);

add()
    .then(() => update())
    .then(() => list())
    .then(() => remove());

function add(): Promise<void> {
    console.log(`Add '${userToAdd.name}'...`);
    return userAccounts.add(userToAdd);
}

function update(): Promise<void> {
    console.log(`Update '${userToAdd.name}' by promoting him from viewer to operator...`);
    const promotion = new User(userToAdd.name, userToAdd.password, AccessRights.Operator, userToAdd.ptz);
    return userAccounts.update(promotion);
}

function list(): Promise<void> {
    console.log('List all users...');
    return userAccounts.getAll()
        .then((users: User[]) => {
            users.forEach((user) => {
                console.log(`  ${user.name} (${AccessRights[user.accessRights]})`);
            });
        });
}

function remove(): Promise<void> {
    console.log(`Remove '${userToAdd.name}'...`);
    return userAccounts.remove(userToAdd.name);
}
