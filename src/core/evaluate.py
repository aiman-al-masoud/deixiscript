from functools import reduce
from typing import Optional
from core.KB import KB
from core.decompress import decompress, isImplicitish, isIndividual, isNounPhrasish
from core.expbuilder import does, e, every
from core.language import GAP, Ast, BinExp, Composite, Def, Explicit, Implicit, Law, SimpleSentence, copy
from core.subst import subst, substDict


def evaluate(ast:Ast, kb:KB)->KB:

    if isinstance(ast, Explicit):
        return kb << ast

    defined=define(ast, kb)

    if ast.cmd:
        return tell(defined, kb)
    else:
        return ask(defined, kb)

def tell(ast:Composite, kb:KB)->KB:

    x1 = tellNegative(ast, kb) if ast.negation else tellPositive(ast, kb)
    x2 = conseq(ast, kb)
    if not x2: return x1
    x3 = e(x2).tell(x1)
    return x3

def ask(ast:Composite, kb:KB)->KB:

    if ast.negation:
        x1=e(copy(ast, negation=False)).ask(kb)
        return x1 << (not x1.head)
    
    return askPositive(ast, kb)

def askPositive(ast:Composite, kb:KB)->KB:

    if isinstance(ast, Implicit):
        return askImplicit(ast, kb)

    match ast:
        case BinExp(op='and'|'or') if isNounPhrasish(ast):
            left = e(ast.left).get(kb)
            right = e(ast.right).get(kb)
            return kb << copy(ast,left=left, right=right)
        case BinExp(op='and'):
            r1 = e(ast.left).ask(kb)
            if not r1.head: return r1
            r2 = e(ast.right).ask(r1)
            return r2
        case BinExp(op='or'):
            r1 = e(ast.left).ask(kb)
            if r1.head: return r1
            r2 = e(ast.right).ask(r1)
            return r2
        case SimpleSentence(verb='be'):
            if ast.object == 'thing': return kb << True
            return e(ast.subject).does('have')._(ast.object).as_('super').ask(kb)
        case SimpleSentence() if ast.verb!='have':
            event = makeEvent(ast)
            return e(event).ask(kb)
        case SimpleSentence(verb='have') if isImplicitish(ast):
            x1 = makeExplicit(ast, kb)
            return e(x1.head).ask(x1)
        case SimpleSentence(verb='have'):
            x=(ast.subject,ast.object,ast.as_)
            return kb << (x in kb.wm)
        case Def():
            raise Exception()
        case Law():
            raise Exception()
        case _:
            raise Exception('askPositive', ast)

def askImplicit(ast:Implicit, kb:KB)->KB:
    
    if ast.concept:
        return askConcept(ast, kb)

    return askIndividual(ast, kb)

def askConcept(ast:Implicit, kb:KB)->KB:
    raise Exception('askConcept', ast)

def askIndividual(ast:Implicit, kb:KB)->KB:

    x0 = {x for s in kb.wm for x in s}
    x1 = [x for x in x0 if isIndividual(x)]
    x2 = [x for x in x1 if e(x).does('be')._(ast.head).get(kb)]
    x3 = [x for x in x2 if e(subst(GAP, x, ast.which)).get(kb)]
    x4 = sorted(x3, key=lambda x:kb.dd[x], reverse=ast.ord=='last')
    x5 = x4[:ast.card]
    if not x5: return kb << False
    x6 = [e(x) for x in x5]
    x7 = reduce(lambda a,b: a.or_(b), x6).e
    return kb << x7

def tellNegative(ast:Composite, kb:KB)->KB:
    match ast:
        case SimpleSentence(verb='have'):
            raise Exception()
        case _: 
            # TODO: wrong
            x1 = e(copy(ast, negation=False)).get(kb)
            # TODO unroll
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = {s for s in kb.wm if set(s) & set(x2)}
            x4 = frozenset(x3)
            return kb - x4

def tellPositive(ast:Composite, kb:KB)->KB:
    
    if isinstance(ast, Implicit):
        return tellImplicit(ast, kb)
    
    match ast:
        case BinExp(op='and'|'or'):
            r1 = e(ast.left).tell(kb)
            r2 = e(ast.right).tell(r1)
            return r2
        case SimpleSentence(verb='be'):
            return e(ast.subject).does('have')._(ast.object).as_('super').tell(kb)
        case SimpleSentence() if ast.verb!='have':
            event = makeEvent(ast)
            old   = e(event).ask(kb)
            if old.head: return old
            return e(event).tell(kb)
        case SimpleSentence(verb='have') if isImplicitish(ast):
            x1 = makeExplicit(ast, kb)            
            return e(x1.head).tell(x1)
        case SimpleSentence(verb='have'):
            x = (ast.subject, ast.object, ast.as_)
            delta = frozenset({x})
            kb1   = kb + delta
            return kb1
        case Def()|Law():
            return kb + ast
        case _:
            raise Exception('tellPositive', ast)

def tellImplicit(ast:Implicit, kb:KB)->KB:
    
    if ast.concept:
        return tellConcept(ast, kb)
    
    return tellIndividual(ast, kb)

def tellConcept(ast:Implicit, kb:KB)->KB:
    raise Exception('tellConcept', ast)

def tellIndividual(ast:Implicit, kb:KB)->KB:
    n = every(ast.head).count(kb)+1
    new = f'{ast.head}#{n}'
    kb1 = kb << new
    r1 = e(new).does('be')._(ast.head).tell(kb1) 
    which = subst(GAP, r1.head, ast.which)
    r2 = e(which).tell(r1)
    return r2 << new

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

def makeEvent(ast:SimpleSentence):
    x1 = ast.args.items()
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def makeExplicit(ast:SimpleSentence, kb:KB)->KB:

    assert ast.verb=='have'

    x1=e(ast.subject).ask(kb)
    x2=e(ast.object).ask(x1)
    x3=e(ast.as_).ask(x2)

    x4=copy(ast, subject=x1.head, object=x2.head, as_=x3.head) # subject=x1.head or ast.subject ...
    x5=decompress(x4)
    return x3 << x5
