from dataclasses import dataclass
from core.explicit import Int, Str
from typing import TYPE_CHECKING
if TYPE_CHECKING: 
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class Implicit:
    head:Str
    card:Int =Int(1)
    ord:'Ast'  =Str('last')
    which:'Ast'=Int(True)
    negation:Int=Int(False)
    cmd:Int=Int(False)
    concept:Int=Int(False)

    def eval(self, kb:'KB')->'KB':
        raise Exception()
        
    def askPositive(self, kb:'KB')->'KB':
        from core.decompress import isIndividual
        from core.subst import subst
        from core.language import GAP
        from functools import reduce
        from core.expbuilder import e

        if self.concept:
            raise Exception()

        x0 = {x for s in kb.wm for x in s}
        x1 = [x for x in x0 if isIndividual(x)]
        x2 = [x for x in x1 if e(x).does('be')._(self.head).get(kb)]
        x3 = [x for x in x2 if e(subst(GAP, x, self.which)).get(kb)]
        x4 = sorted(x3, key=lambda x:kb.dd[x], reverse=self.ord=='last')
        x5 = x4[:self.card]
        if not x5: return kb << Int(False)
        x6 = [e(x) for x in x5]
        x7 = reduce(lambda a,b: a.or_(b), x6).e
        return kb << x7
    
    def tellPositive(self, kb:'KB')->'KB':
        from core.expbuilder import every, e
        from core.subst import subst
        from core.language import GAP

        if self.concept:
            raise Exception()

        n = every(self.head).count(kb)+1
        new = f'{self.head}#{n}'
        kb1 = kb << Str(new)
        r1 = e(new).does('be')._(self.head).tell(kb1) 
        which = subst(GAP, r1.head, self.which)
        r2 = e(which).tell(r1)
        return r2 << Str(new)

    def askNegated(self, kb:'KB')->'KB':
        from core.language import copy
        from core.expbuilder import e
        x1=e(copy(self, negation=Int(False))).ask(kb)
        return x1 << (Int(not x1.head))

    def tellNegative(self, kb:'KB')->'KB':
        from core.expbuilder import e
        from core.language import copy
        # TODO: wrong
        x1 = e(copy(self, negation=Int(False))).get(kb)
        # TODO unroll
        x2 = x1 if isinstance(x1, tuple) else (x1,)
        x3 = {s for s in kb.wm if set(s) & set(x2)}
        x4 = frozenset(x3)
        return kb - x4

    def tell(self, kb:'KB')->'KB':
        from core.expbuilder import e
        from core.evaluate import conseq

        x1=self.tellNegative(kb) if self.negation else self.tellPositive(kb)
        x2=conseq(self, kb)
        if not x2: return x1
        x3 = e(x2).tell(x1)
        return x3

    def ask(self, kb:'KB')->'KB':
        return self.askNegated(kb) if self.negation else self.askPositive(kb)
    
