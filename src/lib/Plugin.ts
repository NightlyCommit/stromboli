import {StromboliProcessorInterface} from "./ProcessorInterface";

export class StromboliPlugin {
    protected _name: string;
    protected _entry: string;
    protected _output: string;
    protected _processors: StromboliProcessorInterface[];

    /**
     * @param name {string}
     * @param entry {string}
     * @param output {string}
     * @param processors {StromboliProcessorInterface[]}
     */
    constructor(name: string, entry: string, output: string, processors: StromboliProcessorInterface[]) {
        this._name = name;
        this._entry = entry;
        this._output = output;
        this._processors = processors;
    }

    /**
     * Returns the plugin name.
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Returns the plugin entry.
     *
     * @returns {string}
     */
    get entry() {
        return this._entry;
    }

    /**
     * Returns the plugin output.
     *
     * @returns {string}
     */
    get output() {
        return this._output;
    }

    /**
     * Returns the plugin processors.
     *
     * @returns {StromboliProcessorInterface[]}
     */
    get processors() {
        return this._processors;
    }
}