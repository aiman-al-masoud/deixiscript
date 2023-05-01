import { nounPhrase } from "./maybe-cst";

export function cstToAst() {

}




export function cstModelToAstModel(cst: typeof nounPhrase) {

    const ast:{[x:string]:any} = {}

    cst.forEach(x => {
        console.log(x)
    })

    return ast
}

