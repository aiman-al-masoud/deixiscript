export interface Wrapper {
    readonly object: any
}

export function wrap(object: any, opts?: WrapOpts) {
    return new BaseWrapper(object, opts)
}

export interface WrapOpts {

}

class BaseWrapper implements Wrapper {

    constructor(readonly object: any, readonly opts?: WrapOpts) {

    }

}