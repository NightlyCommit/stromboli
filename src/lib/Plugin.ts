import {ProcessorInterface} from "./ProcessorInterface";

export class Plugin {
    readonly name: string;
    readonly entry: string;
    readonly output: string;
    readonly processors: ProcessorInterface[];

    /**
     * @param name {string}
     * @param entry {string}
     * @param output {string}
     * @param processors {ProcessorInterface[]}
     */
    constructor(name: string, entry: string, output: string, processors: ProcessorInterface[]) {
        this.name = name;
        this.entry = entry;
        this.output = output;
        this.processors = processors;
    }
}