/* istanbul ignore next */

import {BuildRequest} from "./BuildRequest";

export interface ProcessorInterface {
    /**
     * @param {BuildRequest} request
     * @return {Promise<void>}
     */
    process(request: BuildRequest): Promise<void>;
}