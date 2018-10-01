import {StromboliError} from "./Error";
import {StromboliBinary} from "./Binary";

export class StromboliBuildResponse {
    protected _binaries: StromboliBinary[];
    protected _dependencies: string[];
    protected _errors: StromboliError[];

    constructor(binaries: StromboliBinary[] = [], dependencies: string[] = [], errors: StromboliError[] = []) {
        this._binaries = binaries;
        this._dependencies = dependencies;
        this._errors = errors;
    }

    /**
     * @param {string} value
     */
    addDependency(value: string) {
        if (!this._dependencies.includes(value)) {
            this._dependencies.push(value);
        }
    }

    /**
     * Get the dependencies.
     *
     * @return {string[]}
     */
    get dependencies() {
        return this._dependencies;
    }

    /**
     * @param {string} name
     * @param {Buffer} data
     * @param {Buffer} map
     * @param {string[]} dependencies
     */
    addBinary(name: string, data: Buffer, map?: Buffer, dependencies?: string[]) {
        this._binaries.push(new StromboliBinary(name, data, map, dependencies));
    }

    /**
     * Get the binaries.
     *
     * @returns {StromboliBinary[]}
     */
    get binaries(): StromboliBinary[] {
        return this._binaries;
    }

    /**
     * @param {string} file
     * @param {string} message
     */
    addError(file: string, message: string) {
        this._errors.push(new StromboliError(file, message));
    }

    /**
     * Get the errors.
     *
     * @returns {StromboliError[]}
     */
    get errors() {
        return this._errors;
    }
}