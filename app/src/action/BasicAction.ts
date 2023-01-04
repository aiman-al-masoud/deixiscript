import Action from "./Action";

export class BasicAction implements Action {

    constructor(readonly func: () => any) {
    }

    async run(): Promise<any> {
        return this.func();
    }
}
