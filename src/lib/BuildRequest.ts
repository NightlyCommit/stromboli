import {ComponentInterface} from "./ComponentInterface";
import {Plugin, PluginEOHandler} from "./Plugin";
import {Error} from "./Error";
import {Binary} from "./Binary";
import {Source} from "./Source";

/**
 * @class
 */
export class BuildRequest {
    private readonly _component: ComponentInterface;
    private readonly _plugin: Plugin;
    private readonly _binaries: Binary[];
    private readonly _dependencies: Source[];
    private readonly _errors: Error[];

    /**
     * @constructor
     * @param component
     * @param plugin
     */
    constructor(component: ComponentInterface, plugin: Plugin) {
        this._component = component;
        this._plugin = plugin;
        this._binaries = [];
        this._dependencies = [];
        this._errors = [];
    }

    /**
     * Returns the component of the build request.
     */
    get component(): ComponentInterface {
        return this._component;
    }

    /**
     * Returns the plugin of the build request.
     */
    get plugin(): Plugin {
        return this._plugin;
    }

    /**
     * Returns the binaries built by the build request.
     */
    get binaries(): Binary[] {
        return this._binaries;
    }

    /**
     * Returns the dependencies that were involved in the build of the binaries.
     */
    get dependencies(): Source[] {
        return this._dependencies;
    }

    /**
     * Returns the errors that were catch during the building of the binaries.
     */
    get errors(): Error[] {
        return this._errors;
    }

    /**
     * Returns the entry of the build request.
     */
    get entry(): string {
        let entry = null;

        if (typeof this.plugin.entry === 'function') {
            entry = (this.plugin.entry as PluginEOHandler)(this.component);
        }
        else {
            entry = this.plugin.entry;
        }

        return entry;
    }

    /**
     * Returns the output of the build request.
     */
    get output(): string {
        let output = null;

        if (typeof this.plugin.output === 'function') {
            output = (this.plugin.output as PluginEOHandler)(this.component);
        }
        else {
            output = this.plugin.output;
        }

        return output;
    }

    /**
     * Convenient accessor that returns a promise that resolves to the source of the build request component.
     */
    get source(): Promise<Source> {
        return this.component.getSource(this.entry);
    }

    /**
     * Adds a dependency to the build request.
     *
     * @param {Source} value
     */
    addDependency(value: Source): void {
        if (!this.dependencies.find((source: Source): boolean => {
            return source.name === value.name;
        })) {
            this.dependencies.push(value);
        }
    }

    /**
     * Adds a binary to the build request.
     *
     * @param {Binary} value
     */
    addBinary(value: Binary): void {
        let index = this.binaries.findIndex((binary): boolean => {
            return (binary.name === value.name);
        });

        if (index > -1) {
            this.binaries.splice(index, 1);
        }

        this.binaries.push(value);
    }

    /**
     * Adds an error to the build request.
     *
     * @param {Error} value
     */
    addError(value: Error): void {
        this.errors.push(value);
    }
}