from functools import reduce
from typing import Optional
from core.KB import KB
from core.expbuilder import e
from core.language import Ast, Composite, Explicit
from core.subst import substDict

def evaluate(ast:Ast, kb:KB)->KB:

    if isinstance(ast, Explicit):
        return ast.eval(kb)

    defined=define(ast, kb)

    if ast.cmd:
        return defined.tell(kb)
    else:
        return defined.ask(kb)

def define(ast:Composite, kb:KB)->Composite:

    from core.isMatch import isMatch

    for d in kb.defs:
        m = isMatch(ast, d.definendum)
        if m: 
            x1=substDict(m, d.definition)
            assert isinstance(x1, Composite)
            return define(x1, kb)

    return ast

def conseq(ast:Composite, kb:KB)->Optional[Composite]:
    # TODO: when cause vanishes effects follow suit
    # TODO: match/map/subst
    from core.isMatch import isMatch
    x1 = tuple(d.effect for d in kb.laws if isMatch(ast, d.cause))
    if not x1: return None
    x2 = [e(x) for x in x1]
    x3 = reduce(lambda a,b: a.and_(b), x2).e
    assert isinstance(x3, Composite)
    return x3
