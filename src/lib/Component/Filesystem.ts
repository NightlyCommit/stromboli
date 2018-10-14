import {ComponentInterface} from "../ComponentInterface";
import {Source} from "../Source";

import {join} from 'path';
import {readFile} from 'fs';

export class ComponentFilesystem implements ComponentInterface {
    readonly path: string;

    /**
     * @param path {string}
     */
    constructor(path: string) {
        this.path = path;
    }

    /**
     * @param {string} entry
     * @returns {Promise<Source>}
     */
    getSource(entry: string): Promise<Source> {
        return new Promise((resolve, reject) => {
            let fileName = join(this.path, entry);

            return readFile(fileName, (err: Error, data: Buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new Source(data, fileName));
                }
            });
        });
    }
}