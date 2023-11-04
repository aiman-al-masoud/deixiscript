from typing import Dict, Sequence
from dataclasses import dataclass
from core.BinExp import BinExp
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast
from core.KB import KB 


@dataclass(frozen=True)
class SimpleSentence(Composite):
    verb:'Ast'    =Int(False)
    subject:'Ast' =Int(False)
    object:'Ast'  =Int(False)
    as_:'Ast'     =Int(False)
    to:'Ast'      =Int(False)
    on:'Ast'      =Int(False)
    # adverb:'Ast'  =Int(False)

    def isThingish(self) -> bool:
        return False

    @property
    def args(self)->Dict[str, 'Ast']:
        x1 = [(k,v) for k,v in vars(self).items() if v] # non-falsy
        x2 = [(k,v) for k,v in x1 if k not in {'negation', 'cmd'}]
        x3 = dict(x2)
        return x3

    def askPositive(self, kb:'KB')->'KB':
        
        match self.verb:
            case Str('have'):
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.eval(x1)
                x=(self.subject, self.object, self.as_)
                return kb << Int(x in kb.wm)
            case _:
                return toHave(self).eval(kb)
    
    def tellPositive(self, kb:'KB')->'KB':

        old = self.copy(cmd=Int(0)).eval(kb)
        if old.it: return old

        match self.verb:
            case Str('have'):
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.copy(cmd=Int(1)).eval(x1)
                x=(self.subject, self.object, self.as_)
                return ( kb + frozenset({x}) ) << self.subject
            case _:
                return toHave(self).copy(cmd=Int(1)).eval(kb)
        
        
    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']: # TODO: negation
        from core.someMap import everyMap, someMap

        match sub:
            case SimpleSentence():
                sub_keys=sub.args.keys()
                sup_keys=self.args.keys()
                com_keys=sub_keys&sup_keys
                if com_keys!=sup_keys: return {}
                return everyMap(*[self.args[k].isMatch(sub.args[k]) for k in com_keys])
            case BinExp(op='and'|'or'):
                return someMap(self.isMatch(sub.left), self.isMatch(sub.right))
        
        return {}

    def define(self, kb:'KB')->'Ast':
        d={k:v.define(kb) for k,v in self.args.items()}
        ss=self.copy(**d)
        return Composite.define(ss, kb)

    def tellNegative(self, kb: 'KB') -> 'KB':
        match self.verb:
            case Str('have'):
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.copy(cmd=Int(1)).eval(x1)
                x=(self.subject, self.object, self.as_)
                return x1 - frozenset({x})
            case _:
                return Composite.tellNegative(self, kb)
      

def toHave(ast:SimpleSentence):
    from core.EB import does, every, e
    from functools import reduce

    if ast.verb=='be':
        return e(ast.subject).does('have')._(ast.object).as_('attribute').e

    x1 = ast.args.items()
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4


def makeExplicit(ast:SimpleSentence, kb:'KB')->'KB':
    assert ast.verb=='have'

    # the following ops may create new entities, return KB needed
    x1=ast.subject.eval(kb)
    x2=ast.object.eval(x1)
    x3=ast.as_.eval(x2)

    assert x1.it and x2.it and x3.it

    x4=ast.copy(subject=x1.it, object=x2.it, as_=x3.it)
    x5=decompress(x4)
    return x3 << x5

def decompress(ast:Ast)->Ast:

    if not isinstance(ast, Composite): return ast
    
    conns = findThingishConns(ast)
    if not conns: return ast
    conn = conns[0]

    op = opposite(conn.op) if ast.negation else conn.op
    left = decompress(ast.subst({conn:conn.left}))
    right = decompress(ast.subst({conn:conn.right}))

    return conn.copy(left=left, right=right, op=op, cmd=ast.cmd)

def opposite(x:Ast):
    if x == 'and': return Str('or')
    if x == 'or': return Str('and')
    raise Exception
    
def findThingishConns(ast:Ast)->Sequence[BinExp]:
    if ast.isThingish() and isinstance(ast, BinExp): return [ast]
    return [y for x in vars(ast).values() for y in findThingishConns(x)]