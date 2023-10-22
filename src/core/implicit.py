from dataclasses import dataclass
from core.explicit import Int, Str
from typing import TYPE_CHECKING
if TYPE_CHECKING: 
    from core.language import Ast
    from core.KB import KB


@dataclass(frozen=True)
class Implicit:
    head:Str
    card:Int =Int(1)
    ord:'Ast'  =Str('last')
    which:'Ast'=Int(True)
    negation:Int=Int(False)
    cmd:Int=Int(False)
    concept:Int=Int(False)

    def eval(self, kb:'KB')->'KB':
        raise Exception()

    def ask(self, kb:'KB')->'KB':
        raise Exception()
    
    def tell(self, kb:'KB')->'KB':
        raise Exception()

