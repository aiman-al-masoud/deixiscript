from functools import reduce
from typing import Optional
from core.KB import KB
from core.expbuilder import e
from core.subst import substDict
from core.composite import Composite

def define(ast:Composite, kb:KB)->Composite:

    for d in kb.defs:
        m = d.definendum.isMatch(ast)

        if m: 
            x1=substDict(m, d.definition)
            assert isinstance(x1, Composite)
            return define(x1, kb)

    return ast

def conseq(ast:Composite, kb:KB)->Optional[Composite]:
    # TODO: when cause vanishes effects follow suit
    # TODO: match/map/subst
    x1 = tuple(d.effect for d in kb.laws if d.cause.isMatch(ast))
    if not x1: return None
    x2 = [e(x) for x in x1]
    x3 = reduce(lambda a,b: a.and_(b), x2).e
    assert isinstance(x3, Composite)
    return x3
