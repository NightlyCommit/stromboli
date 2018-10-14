export class Error {
    readonly file: string;
    readonly message: string;

    /**
     * @param file {string}
     * @param message {string}
     */
    constructor(file: string, message: string) {
        this.file = file;
        this.message = message;
    }
}