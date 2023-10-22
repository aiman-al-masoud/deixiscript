from dataclasses import dataclass
from core.composite import Composite
from core.explicit import Int
from typing import TYPE_CHECKING
if TYPE_CHECKING: 
    from core.language import Ast
    from core.KB import KB

@dataclass(frozen=True)
class Def(Composite):
    definendum:'Ast'=Int(False)
    definition:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)

    
    def askPositive(self, kb:'KB')->'KB':
        raise Exception()
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

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
    
