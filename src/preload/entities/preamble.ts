export class Preamble {
    private preamble: Uint8Array;

    constructor(preamble: Uint8Array) {
        this.preamble = preamble;
    }

    getPreamble = (): string => {
        return Array.from(this.preamble).map(byte => String.fromCharCode(byte)).join('');
    }

    print = (): string => {
        return `Preamble: ${this.getPreamble()}`;
    }
}