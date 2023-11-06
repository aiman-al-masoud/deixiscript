from dataclasses import dataclass
from core.Bool import Bool
from core.Composite import Composite
from typing import Dict
from core.Ast import Ast
from core.KB import KB


@dataclass(frozen=True)
class Def(Composite):
    definendum:'Ast'=Bool(False)
    definition:'Ast'=Bool(False)
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        if not isinstance(sub, Def): return {}
        return self.definendum.isMatch(sub.definendum)

    def isThingish(self) -> bool:
        return False
