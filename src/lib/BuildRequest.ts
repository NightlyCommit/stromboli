import {ComponentInterface} from "./ComponentInterface";
import {PluginEOHandler, Plugin} from "./Plugin";
import {Error} from "./Error";
import {Binary} from "./Binary";

export class BuildRequest {
    readonly component: ComponentInterface;
    readonly plugin: Plugin;
    readonly binaries: Binary[];
    readonly dependencies: string[];
    readonly errors: Error[];

    constructor(component: ComponentInterface, plugin: Plugin) {
        this.component = component;
        this.plugin = plugin;
        this.binaries = [];
        this.dependencies = [];
        this.errors = [];
    }

    /**
     * @returns string
     */
    get entry(): string {
        let entry = null;

        if (typeof this.plugin.entry === 'function') {
            entry = (this.plugin.entry as PluginEOHandler)(this.component);
        } else {
            entry = this.plugin.entry;
        }

        return entry;
    }

    /**
     * @returns string
     */
    get output(): string {
        let output = null;

        if (typeof this.plugin.output === 'function') {
            output = (this.plugin.output as PluginEOHandler)(this.component);
        } else {
            output = this.plugin.output;
        }

        return output;
    }

    /**
     * @param {string} value
     */
    addDependency(value: string) {
        if (!this.dependencies.includes(value)) {
            this.dependencies.push(value);
        }
    }

    /**
     * @param {string} name
     * @param {Buffer} data
     * @param {Buffer} map
     * @param {string[]} dependencies
     */
    addBinary(name: string, data: Buffer, map?: Buffer, dependencies?: string[]) {
        let index = this.binaries.findIndex((binary): boolean => {
            return (binary.name === name);
        });

        if (index > -1) {
            this.binaries.splice(index, 1);
        }

        this.binaries.push(new Binary(name, data, map, dependencies));
    }

    /**
     * @param {string} file
     * @param {string} message
     */
    addError(file: string, message: string) {
        this.errors.push(new Error(file, message));
    }
}