import { Protocol } from './Protocol';

/**
 * Class describing a connection to a device.
 */
export class Connection {
    constructor(
        /**
         * The protocol to use when creating the connection.
         */
        public readonly protocol: Protocol,
        /**
         * The address or hostname of the device.
         */
        public readonly address: string,
        /**
         * The port of the device.
         */
        public readonly port: number,
        /**
         * The username.
         */
        public readonly username: string,
        /**
         * The password.
         */
        public readonly password: string) {
    }

    /**
     * Gets the url.
     */
    get url(): string {
        return `${this.protocol === Protocol.Http ? 'http' : 'https'}://${this.address}:${this.port}`;
    }
}
