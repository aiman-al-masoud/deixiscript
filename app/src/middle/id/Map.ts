import Wrapper from "../../backend/wrapper/Wrapper";
import { Id } from "./Id";

type GeneralizedMap<T> = { [a: Id]: T }

/**
 * Id to Id mapping, from one "universe" to another.
 */

export type Map = GeneralizedMap<Id>

export type ThingMap = GeneralizedMap<Wrapper> //<...|undefined>
