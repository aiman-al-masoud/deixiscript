from functools import reduce
from typing import Callable, List, Literal, Type, TypeGuard, cast, get_args, get_origin
from inspect import isclass
from metalang import Derivation, Lit, Map, MetaAst, Pattern, Variable

def match(pat:Pattern, toks:List[Lit], ds:List[Derivation]=[])->Map|None:

    match pat:
        case [mu, p, *ps] if not isSingle(mu) and isSingle(p):
            ms = [match([p], [t], ds) for t in toks]
            c = next((i for i, m in enumerate(ms) if m is not None), None)
            if c is None: return None
            lm = match([mu], toks[:c], ds)
            cm = ms[c]
            rm = match(ps, toks[c+1:], ds)
            return reduceMatchList([cm, lm, rm])
        case [p, *ps] if ps:
            m1 = match([p], toks[:1], ds)
            m2 = match(ps, toks[1:], ds)
            return reduceMatchList([m1, m2])
        case [Variable(n, t, d, num)]:
            if len(toks) > num: return None
            if match([t], toks[:num], ds) is not None: return {n: toks[:num] if num!=1 else toks[0]}
            if d is not None: return {n:[d]}
        case [str(x) | int(x) | float(x)]:
            return {} if toks[0]==x else None
        case [p] if isPredicate(p):
            from parse import parse
            subast = parse(ds, toks)
            return {} if p(subast) else None
        case [t] if get_origin(t)==Literal:
            return {} if toks[0] in set(get_args(t)) else None
        case [t]:
            if not toks: return None
            return {} if isinstance(toks[0], cast(Type, t)) else None
        case []:
            return {} if toks==[] else None
        case _:
            raise Exception('')

def reduceMatchList(ms:List[Map|None]):
    mss = [m for m in ms if m is not None]
    if len(mss) != len(ms): return None
    r = reduce(lambda a,b: {**a, **b}, mss)
    return r

def isPredicate(x:object)->TypeGuard[Callable]:
    if not callable(x): return False
    return not isclass(x) and not get_origin(x)==Literal

def isSingle(x:MetaAst):
    if isinstance(x, Variable): return x.maxCard==1
    return True
    