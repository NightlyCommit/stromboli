export class StromboliBinary {
    private _name: string;
    private _data: Buffer;
    private _map: Buffer;
    private _dependencies: string[];

    /**
     * @param name {string}
     * @param data {Buffer}
     * @param map {Buffer}
     * @param dependencies {string[]}
     */
    constructor(name: string, data: Buffer, map: Buffer = null, dependencies: string[] = []) {
        this._name = name;
        this._data = data;
        this._map = map;
        this._dependencies = dependencies;
    }

    /**
     * @return {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     * @return {Buffer}
     */
    get data(): Buffer {
        return this._data;
    }

    /**
     * @return {Buffer}
     */
    get map(): Buffer {
        return this._map;
    }

    /**
     * @return string[]
     */
    get dependencies(): string[] {
        return this._dependencies;
    }
}