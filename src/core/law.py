from dataclasses import dataclass
from core.composite import Composite
from core.explicit import Int
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class Law(Composite):
    cause:'Ast'=Int(False)
    effect:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)


    def askPositive(self, kb:'KB')->'KB':
        raise Exception()
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self
