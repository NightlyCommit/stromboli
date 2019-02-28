import {Source} from "./Source";

/**
 * Generic and versatile error abstraction
 *
 * @class
 */
export class Error {
    private readonly _source: Source;
    private readonly _message: string;
    private readonly _location: any;

    /**
     * @param message {string} The error message
     * @param source {Source} The source where the error happened
     * @param location {*} The location in the source where the error happened
     */
    constructor(message: string, source: Source, location: any) {
        this._message = message;
        this._source = source;
        this._location = location;
    }

    /**
     * Returns the source where the error happened.
     */
    get source(): Source {
        return this._source;
    }

    /**
     * Returns the error message.
     */
    get message(): string {
        return this._message;
    }

    /**
     * Returns the location in the source where the error happened.
     */
    get location() {
        return this._location;
    }
}