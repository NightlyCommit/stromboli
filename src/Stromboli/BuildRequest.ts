import {StromboliComponent} from "./Component";
import {StromboliPlugin} from "./Plugin";

export class StromboliBuildRequest {
    _component: StromboliComponent;
    _plugin: StromboliPlugin;

    constructor(component: StromboliComponent, plugin: StromboliPlugin) {
        this._component = component;
        this._plugin = plugin;
    }

    /**
     * @return {StromboliComponent}
     */
    get component() {
        return this._component;
    }

    /**
     * @return {StromboliPlugin}
     */
    get plugin() {
        return this._plugin;
    }
}