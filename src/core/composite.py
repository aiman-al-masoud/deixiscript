from dataclasses import dataclass
from core.explicit import Int
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from core.KB import KB 

@dataclass(frozen=True)
class Composite:
    negation:Int=Int(False)
    cmd:Int=Int(False)

    def eval(self, kb:'KB')->'KB':

        from core.evaluate import define
        defined = define(self, kb)
        
        if self.cmd:
            return defined.tell(kb)
        else:
            return defined.ask(kb)

    def tell(self, kb:'KB')->'KB':
        raise Exception()

    def ask(self, kb:'KB')->'KB':
        raise Exception()

