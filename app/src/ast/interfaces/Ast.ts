import Universe from "../../universe/Universe";

export default interface Ast{
    exec(universe:Universe):any
}