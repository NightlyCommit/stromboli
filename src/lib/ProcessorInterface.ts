/* istanbul ignore next */

import {StromboliBuildResponse} from "./BuildResponse";
import {StromboliBuildRequest} from "./BuildRequest";

export interface StromboliProcessorInterface {
    /**
     * @param {StromboliBuildRequest} request
     * @param {StromboliBuildResponse} response
     * @return {Promise<void>}
     */
    process(request: StromboliBuildRequest, response: StromboliBuildResponse): Promise<void>;
}