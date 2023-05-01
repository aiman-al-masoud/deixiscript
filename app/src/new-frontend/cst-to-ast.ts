import { NOUN_PHRASE } from "./maybe-cst";

export function cstToAst() {

}




export function cstModelToAstModel(cst: typeof NOUN_PHRASE) {

    const ast:{[x:string]:any} = {}

    cst.forEach(x => {
        console.log(x)
    })

    return ast
}

