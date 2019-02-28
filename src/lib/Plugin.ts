import {ProcessorInterface} from "./ProcessorInterface";
import {ComponentInterface} from "./ComponentInterface";

export type PluginEOHandler = (component: ComponentInterface) => string;

export class Plugin {
    private readonly _name: string;
    private readonly _entry: string | PluginEOHandler;
    private readonly _output: string | PluginEOHandler;
    private readonly _processors: ProcessorInterface[];

    /**
     * @param name {string}
     * @param entry {string}
     * @param output {string}
     * @param processors {ProcessorInterface[]}
     */
    constructor(name: string, entry: string | PluginEOHandler, output: string | PluginEOHandler, processors: ProcessorInterface[]) {
        this._name = name;
        this._entry = entry;
        this._output = output;
        this._processors = processors;
    }

    get name(): string {
        return this._name;
    }

    get entry(): string | PluginEOHandler {
        return this._entry;
    }

    get output(): string | PluginEOHandler {
        return this._output;
    }

    get processors(): ProcessorInterface[] {
        return this._processors;
    }
}