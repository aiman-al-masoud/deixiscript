import { Id } from "./Actuator";

/**
 * Entity Resolution Table
 */
export default interface Ert{
    getObject(id:Id):any
}