from dataclasses import dataclass
from core.Composite import Composite
from typing import TYPE_CHECKING, Dict, Optional, Sequence
from core.Ast import Ast
from core.Str import Str
from core.Int import Int

if TYPE_CHECKING:
    from core.KB import KB


@dataclass(frozen=True)
class BinExp(Composite):
    op:Str=Str('')
    left:'Ast'=Int(False)
    right:'Ast'=Int(False)
        
    def askPositive(self, kb:'KB')->'KB':
        from core.decompress import isNounPhrasish
        # from core.expbuilder import e

        match self:

            case BinExp(op=Str('and'|'or')) if isNounPhrasish(self):
                left = self.left.eval(kb)
                right= self.right.eval(left)
                return right << self.copy(left=left.head, right=right.head)
            case BinExp(op=Str('and')):
                r1 = self.left.eval(kb)
                if not r1.head: return r1
                r2 = self.right.eval(r1)
                return r2
            case BinExp(op=Str('or')):
                r1 = self.left.eval(kb)
                if r1.head: return r1
                r2 = self.right.eval(r1)
                return r2

        raise Exception()
    
    def tellPositive(self, kb:'KB')->'KB':
        x1 = self.left.tell(kb)
        x2 = self.right.tell(x1 << kb.head)
        return x2

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
                return someMap(self.left.isMatch(sub), self.right.isMatch(sub))
