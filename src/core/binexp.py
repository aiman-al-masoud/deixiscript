from dataclasses import dataclass
from core.explicit import Int, Str
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class BinExp:
    op:Str
    left:'Ast'
    right:'Ast'
    negation:'Ast'=Int(False) # ??
    cmd:'Ast'=Int(False)

    def eval(self, kb:'KB')->'KB':
        raise Exception()