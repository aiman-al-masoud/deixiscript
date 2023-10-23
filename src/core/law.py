from dataclasses import dataclass
from core.composite import Composite
from core.explicit import Int
from typing import TYPE_CHECKING, Dict, Optional
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB


@dataclass(frozen=True)
class Law(Composite):
    cause:'Ast'=Int(False)
    effect:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)

    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if not isinstance(sub, Law): return None
        return self.cause.isMatch(sub.cause)

