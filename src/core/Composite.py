from dataclasses import dataclass
from core.Int import Int
from typing import TYPE_CHECKING, Dict, Sequence, TypeVar
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB 

@dataclass(frozen=True)
class Composite(Ast):
    negation:Int=Int(False)
    cmd:Int=Int(False)

    def eval(self, kb:'KB')->'KB':

        defined = self.define(kb)
        return defined.tell(kb) if self.cmd else defined.ask(kb)

    def tell(self, kb:'KB')->'KB':

        x1=self.tellNegative(kb) if self.negation else self.tellPositive(kb)
        x2=self.conseq(kb)
        if not x2: return x1
        x3=x2.tell(x1)

        return x3

    def ask(self, kb:'KB')->'KB':
        return self.askNegative(kb) if self.negation else self.askPositive(kb)

    def askPositive(self, kb:'KB')->'KB':
        raise Exception()

    def tellPositive(self, kb:'KB')->'KB':
        raise Exception()

    T = TypeVar('T', bound='Ast')
    def copy(self:T, **kwargs:'Ast')->T:
        return self.__class__(**{**vars(self), **kwargs})

    def unroll(self)->Sequence['Ast']:
        return [self]

    def askNegative(self, kb:'KB')->'KB':
        x1=self.copy(negation=Int(False)).ask(kb)
        return x1 << (Int(not x1.head))

    def tellNegative(self, kb:'KB')->'KB':
        from core.expbuilder import e
        # TODO: wrong
        x1 = e(self.copy(negation=Int(False))).get(kb)
        # TODO unroll
        x2 = x1 if isinstance(x1, tuple) else (x1,)
        x3 = {s for s in kb.wm if set(s) & set(x2)}
        x4 = frozenset(x3)
        return kb - x4
    
    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self in map: return map[self]
        d = {k: v.subst(map) for k,v in vars(self).items()}
        return self.__class__(**d)

    def define(self, kb:'KB')->'Ast':

        for d in kb.defs:
            m = d.definendum.isMatch(self)

            if m: 
                x1=d.definition.subst(m)
                return x1.define(kb)

        return self
    
    def conseq(self, kb:'KB'):
        # TODO: when cause vanishes effects follow suit
        # TODO: match/map/subst
        from core.expbuilder import e
        from functools import reduce
        x1 = tuple(d.effect for d in kb.laws if d.cause.isMatch(self))
        if not x1: return None
        x2 = [e(x) for x in x1]
        x3 = reduce(lambda a,b: a.and_(b), x2).e
        assert isinstance(x3, Composite)
        return x3
