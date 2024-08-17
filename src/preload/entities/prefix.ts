export class Prefix {
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    getPrefix = (): string =>{
        return this.prefix;
    }

    print = (): string => {
        return `Prefix: ${this.getPrefix()}`;
    }
}