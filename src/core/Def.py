from dataclasses import dataclass
from core.composite import Composite
from core.explicit import Int
from typing import TYPE_CHECKING, Dict, Optional
if TYPE_CHECKING: 
    from core.language import Ast
    from core.KB import KB

@dataclass(frozen=True)
class Def(Composite):
    definendum:'Ast'=Int(False)
    definition:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if not isinstance(sub, Def): return None
        return self.definendum.isMatch(sub.definendum)


