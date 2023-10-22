from dataclasses import dataclass
from core.explicit import Int
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class Law:
    cause:'Ast'
    effect:'Ast'
    negation:Int=Int(False)
    cmd:Int=Int(False)

    def eval(self, kb:'KB')->'KB':
        raise Exception()

    def ask(self, kb:'KB')->'KB':
        raise Exception()
    
    def tell(self, kb:'KB')->'KB':
        return kb + self

