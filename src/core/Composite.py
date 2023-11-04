from dataclasses import dataclass
from core.Int import Int
from typing import Dict, Sequence, TypeVar
from core.Ast import Ast
from core.KB import KB


@dataclass(frozen=True)
class Composite(Ast):
    negation:Int=Int(False)
    cmd:Int=Int(False)

    def eval(self, kb:'KB')->'KB':

        defined = self.define(kb)

        if not isinstance(defined, Composite): return defined.eval(kb)

        if self.cmd:
            return defined.tell(kb)

        return defined.ask(kb)

    def ask(self, kb:'KB')->'KB':
        return self.askNegative(kb) if self.negation else self.askPositive(kb)

    def tell(self, kb:'KB')->'KB':
        x1=self.tellNegative(kb) if self.negation else self.tellPositive(kb)
        x2=self.conseq(kb)
        if not x2: return x1
        x3=x2.copy(cmd=Int(1)).eval(x1)
        return x3

    T = TypeVar('T', bound='Ast')
    def copy(self:T, **kwargs:'Ast')->T:
        return self.__class__(**{**vars(self), **kwargs})

    def unroll(self)->Sequence['Ast']:
        return [self]

    def askNegative(self, kb:'KB')->'KB':
        x1=self.copy(negation=Int(False)).eval(kb)
        return x1 << (Int(not x1.it))

    def tellNegative(self, kb:'KB')->'KB':
        x1 = self.copy(negation=Int(False)).eval(kb).it
        x2 = set(x1.unroll())
        x3 = {s for s in kb.wm if set(s) & x2}
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
    
    def conseq(self, kb:'KB')->'Ast':
        from core.EB import e
        from functools import reduce
        x1 = [(d.effect, d.cause.isMatch(self)) for d in kb.laws]
        x2 = x1 + [(e(d.effect).not_.e, e(d.cause).not_.e.isMatch(self)) for d in kb.laws] 
        x3 = [x[0].subst(x[1]) for x in x2 if x[1]]
        if not x3: return Int(0)
        x4 = [e(x) for x in x3]
        x5 = reduce(lambda a,b: a.and_(b), x4).e
        return x5