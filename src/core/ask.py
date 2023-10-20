from functools import reduce
from core.expbuilder import does, e, every
from core.language import GAP, Ast, BinExp, Def, Implicit, Law, SimpleSentence, copy
from core.decompressed import decompressed, isImplicitish, isIndividual, isNounPhrasish
from core.subst import subst
from core.KB import KB

# @cache
def ask(ast:Ast, kb:KB)->KB:
    

    match ast:

        case str(x) | int(x) | float(x) | bool(x):
            return kb << x

        case tuple(xs):
            kb1 = reduce(lambda a,b: e(b).ask(a), xs, kb)
            return kb1 << xs

        case _ if ast.cmd:
            x1 = __tell(copy(ast, cmd=False), kb)
            x2 = conseq(ast, kb)   # TODO: why not kb=x2?
            x3 = __tell(x2, x1)
            return x3

        case _ if (x1:=define(ast, kb))!=ast:
            return e(x1).ask(kb)

        case _ if ast.negation:
            x1=e(copy(ast, negation=False)).ask(kb)
            return x1 << (not x1.head)

        case Implicit(head=h, card=card, ord=ord, which=w):
            x0 = {x for s in kb.wm for x in s} 
            # x1 = {x for x in x0 if isIndividual(x) or h=='concept'}
            x1 = {x for x in x0 if isIndividual(x)}
            x2 = tuple(x for x in x1 if e(x).does('be')._(h).get(kb))
            x3 = tuple(x for x in x2 if e(subst(GAP, x, w)).get(kb))
            x4 = tuple(sorted(x3, key=lambda x:kb.dd[x], reverse=ord=='last'))
            x5 = x4[:card]
            x6 = x5[0] if len(x5)==1 else x5
            x7 = e(x6).ask(kb)
            return x7


        case BinExp(op='and'|'or', left=l, right=r) if isNounPhrasish(ast):
            l1 = e(l).get(kb)
            l2 = e(r).get(kb)
            x  = e(l1).binop(ast.op, l2).e
            return kb << x
        case BinExp(op='and', left=l, right=r):
            r1 = e(l).ask(kb)
            if not r1.head: return r1
            r2 = e(r).ask(r1)
            return r2
        case BinExp(op='or', left=l, right=r):
            r1 = e(l).ask(kb)
            if r1.head: return r1
            r2 = e(r).ask(r1)
            return r2
        
        case SimpleSentence(verb='be', subject=s, object=o):
            # if isConcept(s) and o=='concept': return kb << True
            # if isConcept(s) and s==o: return kb << True
            if o == 'thing': return kb << True
            if e(s).does('have')._(o).as_('super').get(kb): return kb << True
            # if  every('thing').which(e(s).does('have')._(_).as_('super').and_(does('have')._(o).as_('super'))).get(kb):true
            # x1 = {x[0] for x in kb.wm if x[2]=='super' and x[1]==o}
            # x2 = {x[1] for x in kb.wm if x[2]=='super' and x[0]==s}
            # x3 = x1 & x2
            # if x3: return kb << True
            return kb << False

        case SimpleSentence() if ast.verb!='have':
            event = makeEvent(ast)
            return e(event).ask(kb)
        
        case SimpleSentence(verb='have') if isImplicitish(ast):
            r = makeExplicit(ast, kb)
            return e(r.head).ask(r)
            
        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            s = (s,o,a)
            ok = s in kb.wm
            return kb << (s if ok else False)

        case _:
            raise Exception('ask', ast)

# @cache
def __tell(ast:Ast, kb:KB)->KB:

    match ast:

                  
        case Def() | Law():
            return kb + ast      

        case int()|float()|str()|bool():
            return kb << ast
        case tuple(xs):
            return reduce(lambda a,b : e(b).tell(a), xs, kb)
        case _ if (x1:=define(ast, kb))!=ast:
            x2 = e(x1).tell(kb)
            return x2

        case ast if ast.negation: # TODO: have sentence negation special case
            x1 = e( copy(ast, negation=False) ).get(kb)
            x2 = x1 if isinstance(x1, tuple) else (x1,)
            x3 = {s for s in kb.wm if set(s) & set(x2)}
            x4 = frozenset(x3)
            return kb - x4

        case Implicit(head=h, which=w):
            n = every(h).count(kb)+1
            new = f'{h}#{n}'
            kb1 = kb << new
            r1 = e(new).does('be')._(h).tell(kb1) 
            which = subst(GAP, r1.head, w)
            r2 = e(which).tell(r1)
            return r2 << new

        case BinExp(op='and'|'or', left=l, right=r):
            r1 = e(l).tell(kb)
            r2 = e(r).tell(r1)
            return r2   

        case SimpleSentence(verb='be', subject=s, object=o):
            return e(s).does('have')._(o).as_('super').tell(kb)

        case SimpleSentence() if ast.verb!='have':
            event = makeEvent(ast)
            old   = e(event).ask(kb)
            if old.head: return old
            return e(event).tell(kb)
        
        case SimpleSentence(verb='have') if isImplicitish(ast):  # semiduplicate
            r = makeExplicit(ast, kb)
            return e(r.head).tell(r)

        case SimpleSentence(verb='have', subject=s, object=o, as_=a):
            delta = frozenset({(s, o, a)})
            kb1   = kb + delta
            return kb1
           
        case _:
            raise Exception('tell', ast)

def makeEvent(ast:SimpleSentence):
    x1 = ast.args
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def define(ast:Ast, kb:KB):
    from core.isMatch import isMatch # maybe match->map then subst, else need to resolve args first and create new KB
    x1 = next((d.definition for d in kb.defs if isMatch(d.definendum, ast)), ast)
    return x1

def conseq(cause:Ast, kb:KB):
    from core.isMatch import isMatch
    x1 = tuple(d.effect for d in kb.laws if isMatch(d.cause, cause))
    # TODO: when cause vanishes effects follow suit
    return x1

# @cache
def makeExplicit(ast:SimpleSentence, kb:KB):

    assert ast.verb=='have'

    x1=e(ast.subject).ask(kb)
    x2=e(ast.object).ask(x1)
    x3=e(ast.as_).ask(x2)
    x4=copy(ast, subject=x1.head, object=x2.head, as_=x3.head) # subject=x1.head or ast.subject ...
    x5=decompressed(x4)
    return x3 << x5

    # def red(a:KB, b:Ast):
    #     r1 = e(b).ask(a)
    #     if not r1.head: return r1 << False # if even just one is missing, all wrong!
    #     return r1 << subst(b, r1.head, a.head)

    # implicits = findAsts(ast, isImplicitNounPhrase) # TODO: sort implicits to avoid sub-ast in super-ast subst problem
    # r = reduce(red, implicits, kb << ast)
    # return r << decompressed(r.head)