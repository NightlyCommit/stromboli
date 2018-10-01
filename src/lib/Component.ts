export class StromboliComponent {
    protected _name: string;
    protected _path: string;

    /**
     * @param name {string}
     * @param path {string}
     */
    constructor(name: string, path: string) {
        this._name = name;
        this._path = path;
    }

    /**
     * Returns the component name.
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     * Returns the component path.
     *
     * @returns {string}
     */
    get path(): string {
        return this._path;
    }
}