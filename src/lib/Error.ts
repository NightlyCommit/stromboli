export class StromboliError {
    protected _file: string;
    protected _message: string;

    /**
     * @param file {string}
     * @param message {string}
     */
    constructor(file: string, message: string) {
        this._file = file;
        this._message = message;
    }

    /**
     * @return {string}
     */
    get file() {
        return this._file;
    }

    /**
     * @return {string}
     */
    get message() {
        return this._message;
    }
}