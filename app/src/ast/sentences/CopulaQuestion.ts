import Universe from "../../universe/Universe";
import BinaryQuestion from "../interfaces/BinaryQuestion";

export default class CopulaQuestion implements BinaryQuestion{
    
    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}