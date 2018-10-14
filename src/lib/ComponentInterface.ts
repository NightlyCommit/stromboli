/* istanbul ignore next */

import {Source} from './Source';

export interface ComponentInterface {
    /**
     * @param {string} entry
     * @returns {Promise<Source>}
     */
    getSource(entry: string): Promise<Source>;
}