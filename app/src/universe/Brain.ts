/**
 * Prolog knowledge base
 */

export default interface Brain{
    find(query:string):any[]
    check(query:string):boolean
    assume(code:string):void
    clone():Brain
}


export class PrologBrain implements Brain{
    find(query: string): any[] {
        throw new Error("Method not implemented.")
    }
    check(query: string): boolean {
        throw new Error("Method not implemented.")
    }
    assume(code: string): void {
        throw new Error("Method not implemented.")
    }
    clone(): Brain {
        throw new Error("Method not implemented.")
    }

}