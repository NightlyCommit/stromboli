import {StromboliComponent} from "./Component";
import {StromboliPlugin} from "./Plugin";

export class StromboliBuildRequest {
    protected _component: StromboliComponent;
    protected _plugin: StromboliPlugin;

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