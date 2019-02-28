import {Source} from "./Source";

/**
 * Generic and versatile binary abstraction
 *
 * @class
 */
export class Binary {
    private readonly _name: string;
    private readonly _data: Buffer;
    private readonly _map: Buffer;
    private readonly _dependencies: Source[];

    /**
     * @param name {string} The binary name
     * @param data {Buffer} The binary data
     * @param map {Buffer} The binary source map
     * @param dependencies {Source[]} The dependencies of the binary
     */
    constructor(name: string, data: Buffer, map: Buffer = null, dependencies: Source[] = []) {
        this._name = name;
        this._data = data;
        this._map = map;
        this._dependencies = dependencies;
    }

    /**
     * Return the binary name.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Return the binary data;
     */
    get data(): Buffer {
        return this._data;
    }

    /**
     * Return the binary source map.
     */
    get map(): Buffer {
        return this._map;
    }

    /**
     * Return the binary dependencies.
     */
    get dependencies(): Source[] {
        return this._dependencies;
    }
}
