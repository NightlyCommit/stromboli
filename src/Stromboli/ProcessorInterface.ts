/* istanbul ignore next */

import {StromboliBuildResponse} from "./BuildResponse";
import {StromboliBuildRequest} from "./BuildRequest";

export interface StromboliProcessorInterface {
    /**
     * @param {StromboliBuildRequest} request
     * @param {StromboliBuildResponse} response
     */
    process(request: StromboliBuildRequest, response: StromboliBuildResponse): void;
}