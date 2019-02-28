import {ComponentInterface} from "../ComponentInterface";
import {Source} from "../Source";

import {join} from 'path';
import {readFile} from 'fs';

/**
 * Component that resolves its source from the filesystem.
 *
 * @class
 */
export class ComponentFilesystem implements ComponentInterface {
    private readonly _path: string;

    /**
     * @param path {string} The name of the component
     */
    constructor(path: string) {
        this._path = path;
    }

    /**
     * Return the name of the component.
     */
    get path(): string {
        return this._path;
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
                    resolve(new Source(fileName, data));
                }
            });
        });
    }
}