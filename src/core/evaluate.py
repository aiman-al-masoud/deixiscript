from functools import reduce
from typing import Optional
from core.KB import KB
from core.expbuilder import e
from core.language import Ast, Composite, Explicit, SimpleSentence, Str, copy
from core.subst import substDict
from core.explicit import Int

def evaluate(ast:Ast, kb:KB)->KB:

    if isinstance(ast, Explicit):
        return ast.eval(kb)

    defined=define(ast, kb)

    if ast.cmd:
        return tell(defined, kb)
    else:
        return ask(defined, kb)

def tell(ast:Composite, kb:KB)->KB:

    x1 = tellNegative(ast, kb) if ast.negation else ast.tell(kb)
    x2 = conseq(ast, kb)
    if not x2: return x1
    x3 = e(x2).tell(x1)
    return x3

def ask(ast:Composite, kb:KB)->KB:

    if ast.negation:
        x1=e(copy(ast, negation=Int(False))).ask(kb)
        return x1 << (Int(not x1.head))
    
    return ast.ask(kb)

def tellNegative(ast:Composite, kb:KB)->KB:
    match ast:
        case SimpleSentence(verb=Str('have')):
            raise Exception()
        case _: 
            # TODO: wrong
            x1 = e(copy(ast, negation=Int(False))).get(kb)
            # TODO unroll
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = {s for s in kb.wm if set(s) & set(x2)}
            x4 = frozenset(x3)
            return kb - x4


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
