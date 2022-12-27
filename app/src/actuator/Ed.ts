import { Id } from "../clauses/Id";

/**
 * Entity Dictionary... (or Everett Ducklair)
 */
export interface Ed{
    get(id:Id):any
    set(id:Id, object:any):void
}

export default function getEd():Ed{
    throw new Error('not implemented!')
}