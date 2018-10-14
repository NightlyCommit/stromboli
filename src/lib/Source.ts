export class Source {
    readonly code: Buffer;
    readonly path: string;

    /**
     * @param code {Buffer}
     * @param path {string}
     */
    constructor(code: Buffer, path: string = '') {
        this.code = code;
        this.path = path;
    }
}