from typing import Callable, List, Literal, Sequence, Type, TypeGuard, cast, get_args, get_origin
from functools import reduce
from inspect import isclass
from parser.metalang import Derivation, Lit, Map, MetaAst, Pattern, Variable

def match(pat:Pattern, toks:List[Lit], ds:List[Derivation]=[])->Map|None:

    match pat:
        case [mu, p, *ps] if not isSingle(mu) and isSingle(p):

            def check(i:int, t:Lit):
                C = match([p], [t], ds)
                if C is None: return None
                L = match([mu], toks[:i], ds)
                if L is None: return None
                R = match(ps, toks[i+1:], ds)
                if R is None: return None
                return (C, L, R)

            ms = [check(i, t) for i, t in enumerate(toks)]
            m = next((m for m in ms if m is not None), None)
            if m is None: return None

            return reduceMatchList(m)

        case [p, *ps] if ps:
            m1 = match([p], toks[:1], ds)
            m2 = match(ps, toks[1:], ds)
            return reduceMatchList([m1, m2])
        case [Variable(n, t, d, num)]:
            if len(toks) > num: return None
            m1 = match([t], toks[:num], ds) is not None
            if not m1 and d is None: return None
            if not m1 and toks[:num]: return None # defaults apply only if there are NO tokens, not if there are tokens but they're WRONG!
            seq = toks if m1 else [d]
            value = seq[:num] if num!=1 else seq[0]
            return {n : value}
        case [str(x) | int(x) | float(x)]:
            if not toks: return None
            return {} if toks[0]==x else None
        case [p] if isPredicate(p):
            if not toks: return None
            from parser.parse import parse
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

def reduceMatchList(ms:Sequence[Map|None]):
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
    