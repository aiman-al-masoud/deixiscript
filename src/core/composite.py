from dataclasses import dataclass
from core.explicit import Int
from typing import TYPE_CHECKING, Sequence, TypeVar

if TYPE_CHECKING:
    from core.KB import KB 
    from core.language import Ast

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

    T = TypeVar('T', bound='Ast')
    def copy(self:T, **kwargs:'Ast')->T:
        return self.__class__(**{**vars(self), **kwargs})

    def unroll(self)->Sequence['Ast']:
        return [self]