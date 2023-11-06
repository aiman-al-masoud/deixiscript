from typing import Dict, Sequence
from dataclasses import dataclass
from core.BinExp import BinExp
from core.Bool import Bool
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast
from core.KB import KB 


@dataclass(frozen=True)
class SimpleSentence(Composite):
    verb:'Ast'    =Bool(False)
    subject:'Ast' =Bool(False)
    object:'Ast'  =Bool(False)
    as_:'Ast'     =Bool(False)
    to:'Ast'      =Bool(False)
    on:'Ast'      =Bool(False)
    # adverb:'Ast'  =Bool(False)

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
                return kb << Bool(x in kb.wm)
            case _:
                return toHave(self).eval(kb)
    
    def tellPositive(self, kb:'KB')->'KB':

        old = self.copy(cmd=Bool(0)).eval(kb)
        if old.it: return old

        match self.verb:
            case Str('have'):
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.copy(cmd=Bool(1)).eval(x1)
                x=(self.subject, self.object, self.as_)
                return ( kb + frozenset({x}) ) << self.subject
            case _:
                return toHave(self).copy(cmd=Bool(1)).eval(kb)
        
    def tellNegative(self, kb: 'KB') -> 'KB':
        match self.verb:
            case Str('have'|'be'):
                if self.verb=='be': return toHave(self).copy(cmd=Bool(1), negation=Bool(1)).eval(kb)
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.copy(cmd=Bool(1), negation=Bool(1)).eval(x1)
                edge = (self.subject, self.object, self.as_)
                return x1 - frozenset({edge})
            case _:
                return toHave(self).copy(cmd=Bool(1), negation=Bool(1)).eval(kb)
        
    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        from core.someMap import everyMap, someMap

        match sub:
            case SimpleSentence():
                sub_keys=sub.args.keys()
                sup_keys=self.args.keys()
                com_keys=sub_keys&sup_keys
                if com_keys!=sup_keys: return {}
                result = everyMap(*[self.args[k].isMatch(sub.args[k]) for k in com_keys])
            case BinExp(op='and'|'or'):
                result = someMap(self.isMatch(sub.left), self.isMatch(sub.right))
            case _:
                result = {}

        return result if self.isNegative() == sub.isNegative() else {}

    def define(self, kb:'KB')->'Ast':
        d={k:v.define(kb) for k,v in self.args.items()}
        ss=self.copy(**d)
        return Composite.define(ss, kb)

def toHave(ast:SimpleSentence):
    from core.EB import does, every, e
    from functools import reduce

    if ast.verb =='have':
        return ast

    if ast.verb=='be':
        return e(ast.subject).does('have')._(ast.object).as_('attribute').e

    x1 = ast.args.items()
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def makeExplicit(ast:SimpleSentence, kb:'KB')->'KB':
    assert ast.verb=='have'

    # the following ops may create new entities => need to return KB
    x1=ast.subject.eval(kb)
    x2=ast.object.eval(x1)
    x3=ast.as_.eval(x2)

    assert x1.it and x2.it and x3.it, "undefined reference"

    x4=ast.copy(subject=x1.it, object=x2.it, as_=x3.it)
    x5=decompress(x4)
    return x3 << x5

def decompress(ast:Ast)->Ast:

    conns = findThingishConns(ast)
    if not conns: return ast
    conn = conns[0]

    op = opposite(conn.op) if ast.isNegative() else conn.op
    left = decompress(ast.subst({conn:conn.left}))
    right = decompress(ast.subst({conn:conn.right}))

    return conn.copy(left=left, right=right, op=op, cmd=Bool(ast.isCmd()))

def opposite(x:Ast):
    if x == 'and': return Str('or')
    if x == 'or': return Str('and')
    raise Exception
    
def findThingishConns(ast:Ast)->Sequence[BinExp]:
    if ast.isThingish() and isinstance(ast, BinExp): return [ast]
    return [y for x in vars(ast).values() for y in findThingishConns(x)]