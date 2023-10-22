from dataclasses import dataclass
from core.explicit import Int, Str
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class BinExp:
    op:Str
    left:'Ast'
    right:'Ast'
    negation:'Ast'=Int(False) # ??
    cmd:'Ast'=Int(False)

    def eval(self, kb:'KB')->'KB':
        raise Exception()

    def askPositive(self, kb:'KB')->'KB':
        from core.decompress import isNounPhrasish
        from core.expbuilder import e
        from core.language import copy

        match self:

            case BinExp(op=Str('and'|'or')) if isNounPhrasish(self):
                left = e(self.left).get(kb)
                right = e(self.right).get(kb)
                return kb << copy(self,left=left, right=right)
            case BinExp(op=Str('and')):
                r1 = e(self.left).ask(kb)
                if not r1.head: return r1
                r2 = e(self.right).ask(r1)
                return r2
            case BinExp(op=Str('or')):
                r1 = e(self.left).ask(kb)
                if r1.head: return r1
                r2 = e(self.right).ask(r1)
                return r2

        raise Exception()
    
    def tellPositive(self, kb:'KB')->'KB':
        # raise Exception()
        from core.expbuilder import e
        r1 = e(self.left).tell(kb)
        r2 = e(self.right).tell(r1)
        return r2

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
        return self.tellNegative(kb) if self.negation else self.tellPositive(kb)

    def ask(self, kb:'KB')->'KB':
        return self.askNegated(kb) if self.negation else self.askPositive(kb)
    
