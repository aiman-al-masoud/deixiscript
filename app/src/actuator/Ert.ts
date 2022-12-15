import { Id } from "./Actuator";

/**
 * Entity Resolution Table
 */
export default interface Ert{
    get(id:Id):any
}