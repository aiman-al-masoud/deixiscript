import { ActionArgs, ObjArgs } from "../actuator/Actuator"
import Predicate from "./Predicate"

export default class AttributePredicate implements Predicate{

    constructor(readonly data:AttributePredicateData){

    }

    apply(args: ObjArgs) {

        

        let prop = args.subject[this.data.propPath[0]]

        for(let i=1; i<this.data.propPath.length; i++){
            prop = prop[this.data.propPath[i]]
        }

        prop = this.data.propValue
    }

}

export interface AttributePredicateData{
    concept:string // eg: 'color'
    name:string // eg: 'black'
    // aliases:string[] // eg: ['dark']
    propPath:string[] // eg: ['style', 'background']
    propValue:any // eg: 'black'
}



