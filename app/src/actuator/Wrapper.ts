export interface Wrapper {
    readonly object: any
    readonly jsName: string
}

export function wrap(object: any, opts?: WrapOpts) {
    return new BaseWrapper(object, opts?.jsName ?? '')
}

export interface WrapOpts {
    jsName: string
}

class BaseWrapper implements Wrapper {

    constructor(readonly object: any, readonly jsName = '') {

    }

}