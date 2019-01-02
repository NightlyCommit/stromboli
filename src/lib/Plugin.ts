import {ProcessorInterface} from "./ProcessorInterface";
import {ComponentInterface} from "./ComponentInterface";

export type PluginEOHandler = (component: ComponentInterface) => string;

export class Plugin {
    readonly name: string;
    readonly entry: string | PluginEOHandler;
    readonly output: string | PluginEOHandler;
    readonly processors: ProcessorInterface[];

    /**
     * @param name {string}
     * @param entry {string}
     * @param output {string}
     * @param processors {ProcessorInterface[]}
     */
    constructor(name: string, entry: string | PluginEOHandler, output: string | PluginEOHandler, processors: ProcessorInterface[]) {
        this.name = name;
        this.entry = entry;
        this.output = output;
        this.processors = processors;
    }
}