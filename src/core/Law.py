from typing import Dict
from dataclasses import dataclass
from core.Bool import Bool
from core.Composite import Composite
from core.Ast import Ast
from core.KB import KB


@dataclass(frozen=True)
class Law(Composite):
    cause:'Ast'=Bool(False)
    effect:'Ast'=Bool(False)

    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        if not isinstance(sub, Law): return {}
        return self.cause.isMatch(sub.cause)

    def isThingish(self) -> bool:
        return False

