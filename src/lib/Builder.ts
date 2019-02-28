import {ComponentInterface} from "./ComponentInterface";
import {BuildRequest} from "./BuildRequest";
import {Plugin} from "./Plugin";

/**
 * @class
 */
export class Builder {
    /**
     * Builds the component passed as parameter with the plugins passed as parameter and resolves with the processed build requests.
     *
     * @param component {ComponentInterface}
     * @param plugins {Plugin[]}
     * @return {Promise<Map<string, BuildRequest>>}
     */
    buildComponent(component: ComponentInterface, plugins: Plugin[]) {
        let requests: Map<string, BuildRequest> = new Map();

        return Promise.all(plugins.map((plugin) => {
            return this.buildComponentWithPlugin(component, plugin).then(
                function (buildRequest: BuildRequest) {
                    requests.set(plugin.name, buildRequest);
                }
            );
        })).then(() => {
            return requests;
        });
    };

    /**
     * Builds the component passed as parameter with the plugin passed as parameter and resolves with the processed build request.
     *
     * @param component {ComponentInterface}
     * @param plugin {Plugin}
     * @returns {Promise<BuildRequest>}
     */
    buildComponentWithPlugin(component: ComponentInterface, plugin: Plugin): Promise<BuildRequest> {
        let buildRequest = new BuildRequest(component, plugin);

        let processFunctions: Function[] = plugin.processors.map((processor) => {
            return processor.process.bind(processor);
        });

        return processFunctions.reduce((accumulator, currentValue) => {
            return accumulator.then(() => {
                return currentValue(buildRequest);
            });
        }, Promise.resolve()).then(
            () => {
                return buildRequest;
            }
        );
    };
}
