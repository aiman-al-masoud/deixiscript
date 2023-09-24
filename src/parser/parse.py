from typing import Dict, List
from match import Lit, Map, match
from metalang import Derivation


def parse(ds:List[Derivation], toks:List[Lit]|Dict[str, object]|object):

    match toks:
        case list(xs):
            r1 = [match(d.pat, xs) for d in ds]
            r2 = zip(r1, ds)
            r3 = next((subst(x[1].definition, x[0]) for x in r2 if x[0] is not None), None)
            if r3 is None: return toks
            r4 = parse(ds, r3)
            return r4
        case dict(d): # TODO: any object
            return {k:parse(ds, v) for k,v in d.items()}
        case str(x)|int(x)|float(x):
            return x
        case _:
            raise Exception('')

def subst(ast:object, map:Map):
    match ast:
        case str(x):
            return map.get(x, x)
        case dict(d):
            return {k:subst(v, map) for k,v in d.items()}
        case _:
            return ast
