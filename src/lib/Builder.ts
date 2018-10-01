import {StromboliPlugin} from "./Plugin";
import {StromboliComponent} from "./Component";
import {StromboliBuildRequest} from "./BuildRequest";
import {StromboliBuildResponse} from "./BuildResponse";
import {StromboliBinary} from "./Binary";

export class StromboliBuilder {
    /**
     *
     * @param {StromboliComponent[]} components
     * @param {StromboliPlugin[]} plugins
     * @return {Promise<StromboliComponent[]>}
     */
    start(components: StromboliComponent[], plugins: StromboliPlugin[]) {
        return Promise.all(components.map((component) => {
            return this.buildComponent(component, plugins);
        }));
    };

    /**
     * Build the component passed as parameters with the plugins passed as parameter and resolve with the build responses.
     *
     * @param component {StromboliComponent}
     * @param plugins {StromboliPlugin[]}
     * @return {Promise<Map<string, StromboliBuildResponse>>}
     */
    buildComponent(component: StromboliComponent, plugins: StromboliPlugin[]) {
        let responses: Map<string, StromboliBuildResponse> = new Map();

        return Promise.all(plugins.map((plugin) => {
            return this.buildComponentWithPlugin(component, plugin).then(
                function (buildResponse: StromboliBuildResponse) {
                    responses.set(plugin.name, buildResponse);
                }
            );
        })).then(() => {
            return responses;
        });
    };

    /**
     * Build the component passed as parameter with the plugin passed as parameter and resolve with the build result.
     *
     * @param component {StromboliComponent}
     * @param plugin {StromboliPlugin}
     * @returns {Promise<StromboliBuildResponse>}
     */
    buildComponentWithPlugin(component: StromboliComponent, plugin: StromboliPlugin): Promise<StromboliBuildResponse> {
        let buildRequest = new StromboliBuildRequest(component, plugin);
        let buildResponse = new StromboliBuildResponse();

        let processFunctions: Function[] = plugin.processors.map((processor) => {
            return processor.process.bind(processor);
        });

        return processFunctions.reduce((accumulator, currentValue) => {
            return accumulator.then(() => {
                return currentValue(buildRequest, buildResponse);
            });
        }, Promise.resolve()).then(
            () => {
                return buildResponse;
            }
        );
    };
}
