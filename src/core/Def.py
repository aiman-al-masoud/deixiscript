from dataclasses import dataclass
from core.Composite import Composite
from core.Int import Int
from typing import TYPE_CHECKING, Dict, Optional
from core.Ast import Ast

if TYPE_CHECKING: 
    from core.KB import KB

@dataclass(frozen=True)
class Def(Composite):
    definendum:'Ast'=Int(False)
    definition:'Ast'=Int(False)
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if not isinstance(sub, Def): return None
        return self.definendum.isMatch(sub.definendum)


