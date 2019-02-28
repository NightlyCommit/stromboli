/**
 * Generic and versatile source abstraction
 *
 * @class
 */
export class Source {
    private readonly _data: any;
    private readonly _name: string;

    /**
     * @param name {string} The name of the source
     * @param data {*} The data of the source
     */
    constructor(name: string, data: any) {
        this._data = data;
        this._name = name;
    }

    /**
     * Returns the data of the source.
     */
    get data(): any {
        return this._data;
    }

    /**
     * Returns the name of the source.
     */
    get name(): string {
        return this._name;
    }
}