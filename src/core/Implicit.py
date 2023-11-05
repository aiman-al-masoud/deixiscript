import sys
from typing import Collection, Dict
from dataclasses import dataclass
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast
from core.KB import KB


@dataclass(frozen=True)
class Implicit(Composite):
    head:Str      =Str(False)
    card:Int      =Int(1)
    ord:'Ast'     =Str('last')
    which:'Ast'   =Int(True)
    
    def askPositive(self, kb:'KB')->'KB':
        from core.EB import e

        x0 = {x for s in kb.wm for x in s if isIndividual(x)}
        x1 = [x for x in x0 if e(x).reallyIs(self.head).get(kb)]
        x2 = [x for x in x1 if e(self.which.subst({Str.GAP:x})).get(kb)]
        x4 = sortAndTrim(x2, kb, self.ord, self.card)
        return kb << x4

    def tellPositive(self, kb:'KB')->'KB':
        from core.EB import every, e

        n = every(self.head).count(kb)+1
        new = f'{self.head}#{n}'
        x1 = kb << Str(new)
        x2 = e(new).reallyIs(self.head).tell(x1)
        which = self.which.subst({Str.GAP:x2.it})
        r2 = which.copy(cmd=Int(1)).eval(x2)
        return r2 << Str(new)

    def askNegative(self, kb: 'KB') -> 'KB':
        x1= self.copy(card=Int(sys.maxsize)).askPositive(kb)
        x2=set(x1.it.unroll())
        allIndividuals = {x for s in kb.wm for x in s if isIndividual(x)}
        x3=allIndividuals-x2
        from core.EB import e
        x4 = [x for x in x3 if e(self.which.subst({Str.GAP:x})).get(kb)]
        x4=sortAndTrim(x4, kb, self.ord, self.card)
        return kb << x4

    def tellNegative(self, kb:'KB')->'KB':
        x1 = self.copy(negation=Int(False), cmd=Int(False)).eval(kb).it
        x2 = set(x1.unroll())
        x3 = {s for s in kb.wm if set(s) & x2}
        x4 = frozenset(x3)
        return kb - x4
    
    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        from core.someMap import everyMap
        if not isinstance(sub, Implicit): return {}      
        ok = everyMap(self.head.isMatch(sub.head), self.which.isMatch(sub.which))
        return {self:sub} if ok and self.isNegative()==sub.isNegative() else {}
    
    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self.which!=True: return self
        return super().subst(map)

    def isThingish(self) -> bool:
        return True

    def define(self, kb:'KB')->'Ast':
        return super().define(kb).copy(card=self.card, ord=self.ord) #cmd=self.cmd   neg???

def isIndividual(x:Ast):
    return  isinstance(x, str) and ('#' in x or ' ' in x)  or isinstance(x, int)

def sortAndTrim(things:Collection[Ast], kb:'KB', ord:Ast, card:Int):
    from functools import reduce
    from core.EB import e
    x4 = sorted(things, key=lambda x:kb.dd[x], reverse=ord=='last')
    x5 = x4[:card]
    if not x5: return Int(False)
    x6 = [e(x) for x in x5]
    x7 = reduce(lambda a,b: a.or_(b), x6).e
    return x7