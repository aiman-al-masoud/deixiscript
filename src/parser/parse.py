from typing import List
from parser.match import Map, match
from parser.metalang import Derivation


def parse(ds:List[Derivation], toks:object):

    match toks:
        case list(xs):
            r1 = [match(d.pat, xs, ds) for d in ds]
            r2 = zip(r1, ds)
            r3 = next((subst(d.definition, m) for m,d in r2 if m is not None), None)
            if r3 is None: return toks
            r4 = parse(ds, r3)
            return r4
        case str(x)|int(x)|float(x):
            return x
        case dict(d): 
            return {k:parse(ds, v) for k,v in d.items()}
        case object() if toks and hasattr(toks, '__dict__'):
            x1 = vars(toks)
            x2 = parse(ds, x1)
            x3 = toks.__class__(**x2)
            return x3
        case _:
            raise Exception('parse', toks)

def subst(ast:object, map:Map):
    match ast:
        case str(x):
            return map.get(x, x)
        case dict(d):
            return {k:subst(v, map) for k,v in d.items()}
        case object() if ast and hasattr(ast, '__dict__'):
            x1 = vars(ast)
            x2 = subst(x1, map)
            x3 = ast.__class__(**x2)
            return x3
        case _:
            return ast
