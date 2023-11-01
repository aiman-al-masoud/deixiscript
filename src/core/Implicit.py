from typing import TYPE_CHECKING, Collection, Dict, Optional
from dataclasses import dataclass
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast

if TYPE_CHECKING: 
    from core.KB import KB


@dataclass(frozen=True)
class Implicit(Composite):
    head:Str      =Str(False)
    card:Int      =Int(1)
    ord:'Ast'     =Str('last')
    which:'Ast'   =Int(True)
    concept:Int   =Int(False)
        
    def askPositive(self, kb:'KB')->'KB':
        from core.expbuilder import e

        if kb.concept or self.concept:
            raise Exception

        x0 = {x for s in kb.wm for x in s if isIndividual(x)}
        x2 = [x for x in x0 if e(x).does('be')._(self.head).get(kb)]# maybe no need for complicated "be"? maybe Defs can handle complications and here just do (x,y,z) test?
        x3 = [x for x in x2 if e(self.which.subst({Str.GAP:x})).get(kb)]
        return sortAndTrim(x3, kb, self.ord, self.card)
    
    def tellPositive(self, kb:'KB')->'KB':
        from core.expbuilder import every, e

        if kb.concept or self.concept:
            raise Exception

        n = every(self.head).count(kb)+1
        new = f'{self.head}#{n}'
        x1 = kb << Str(new)
        x2 = e(new).does('be')._(self.head).tell(x1)  # ...also here
        which = self.which.subst({Str.GAP:x2.it})
        r2 = which.copy(cmd=Int(1)).eval(x2)
        return r2 << Str(new)

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        from core.isMatch import everyMap
        if not isinstance(sub, Implicit): return {}      
        ok = everyMap(self.head.isMatch(sub.head), self.which.isMatch(sub.which))
        return {self:sub} if ok else {}
    
    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self.which!=True: return self
        return super().subst(map)

    def askNegative(self, kb: 'KB') -> 'KB':

        x1=self.askPositive(kb)
        x2=set(x1.it.unroll())
        allIndividuals = {x for s in kb.wm for x in s if isIndividual(x)}
        x3=allIndividuals-x2
        return sortAndTrim(x3, kb, self.ord, self.card)
    
    def isThingish(self) -> bool:
        return True

def isIndividual(x:Ast):
    return isinstance(x, str) and '#' in x

def sortAndTrim(things:Collection[Ast], kb:'KB', ord:Ast, card:Int):
    from functools import reduce
    from core.expbuilder import e
    x4 = sorted(things, key=lambda x:kb.dd[x], reverse=ord=='last')
    x5 = x4[:card]
    if not x5: return kb << Int(False)
    x6 = [e(x) for x in x5]
    x7 = reduce(lambda a,b: a.or_(b), x6).e
    x8=kb << x7
    return x8