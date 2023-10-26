from typing import TYPE_CHECKING, Dict, Optional
from dataclasses import dataclass
from core.Composite import Composite
from core.Int import Int
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB


@dataclass(frozen=True)
class Law(Composite):
    cause:'Ast'=Int(False)
    effect:'Ast'=Int(False)

    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if not isinstance(sub, Law): return None
        return self.cause.isMatch(sub.cause)

