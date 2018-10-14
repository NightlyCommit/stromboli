export class Binary {
    readonly name: string;
    readonly data: Buffer;
    readonly map: Buffer;
    readonly dependencies: string[];

    /**
     * @param name {string}
     * @param data {Buffer}
     * @param map {Buffer}
     * @param dependencies {string[]}
     */
    constructor(name: string, data: Buffer, map: Buffer = null, dependencies: string[] = []) {
        this.name = name;
        this.data = data;
        this.map = map;
        this.dependencies = dependencies;
    }
}
