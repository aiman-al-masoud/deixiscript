from dataclasses import dataclass
from core.composite import Composite
from core.explicit import Int, Str
from typing import TYPE_CHECKING, Dict, Optional, Sequence
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB


@dataclass(frozen=True)
class BinExp(Composite):
    op:Str=Str('')
    left:'Ast'=Int(False)
    right:'Ast'=Int(False)
    negation:'Ast'=Int(False) # ??
    cmd:'Ast'=Int(False)
        
    def askPositive(self, kb:'KB')->'KB':
        from core.decompress import isNounPhrasish
        from core.expbuilder import e

        match self:

            case BinExp(op=Str('and'|'or')) if isNounPhrasish(self):
                left = e(self.left).get(kb)
                right = e(self.right).get(kb)
                return kb << self.copy(left=left, right=right)
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
        from core.expbuilder import e
        r1 = e(self.left).tell(kb)
        r2 = e(self.right).tell(r1)
        return r2

    def unroll(self)->Sequence['Ast']:
        x1 = self.left.unroll()
        x2 = self.right.unroll() 
        return [*x1, *x2]

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:

        from core.isMatch import everyMap, someMap

        match self:
            case BinExp(op='and'):
                return everyMap(self.left.isMatch(sub), self.right.isMatch(sub))

            case BinExp(op='or'):
                # return someone(isMatch(sub, sup.left), isMatch(sub, sup.right))
                return someMap(self.left.isMatch(sub), self.right.isMatch(sub))
