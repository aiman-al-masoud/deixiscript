from typing import TYPE_CHECKING, Dict, Optional
from dataclasses import dataclass
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast

if TYPE_CHECKING: 
    from core.KB import KB


@dataclass(frozen=True)
class Implicit(Composite):
    head:Str      =Str('')
    card:Int      =Int(1)
    ord:'Ast'     =Str('last')
    which:'Ast'   =Int(True)
    negation:Int  =Int(False)
    cmd:Int       =Int(False)
    concept:Int   =Int(False)
        
    def askPositive(self, kb:'KB')->'KB':
        from functools import reduce
        from core.expbuilder import e

        if kb.concept or self.concept:
            raise Exception()

        x0 = {x for s in kb.wm for x in s}
        x1 = [x for x in x0 if isIndividual(x)]
        x2 = [x for x in x1 if e(x).does('be')._(self.head).get(kb)]
        x3 = [x for x in x2 if e(self.which.subst({Str.GAP:x})).get(kb)]
        x4 = sorted(x3, key=lambda x:kb.dd[x], reverse=self.ord=='last')
        x5 = x4[:self.card]
        if not x5: return kb << Int(False)
        x6 = [e(x) for x in x5]
        x7 = reduce(lambda a,b: a.or_(b), x6).e
        return kb << x7
    
    def tellPositive(self, kb:'KB')->'KB':
        from core.expbuilder import every, e

        if kb.concept or self.concept:
            raise Exception()

        n = every(self.head).count(kb)+1
        new = f'{self.head}#{n}'
        kb1 = kb << Str(new)
        r1 = e(new).does('be')._(self.head).tell(kb1) 

        which = self.which.subst({Str.GAP:r1.head})
        r2 = e(which).tell(r1)
        return r2 << Str(new)

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        from core.isMatch import everyMap
        if not isinstance(sub, Implicit): return None
        
        # if sup.card > sub.card: return False
        ok = everyMap(self.head.isMatch(sub.head), self.which.isMatch(sub.which))
        return {self:sub} if ok else None
    
    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self.which!=True: return self
        return super().subst(map)

    # TODO: askNegative returning everything that does not match this type

def isIndividual(x:Ast):
    return isinstance(x, str) and '#' in x
