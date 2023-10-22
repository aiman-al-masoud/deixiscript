from dataclasses import dataclass
from core.explicit import Int
from typing import TYPE_CHECKING, Sequence, TypeVar
from core.language import Ast

if TYPE_CHECKING:
    from core.KB import KB 

@dataclass(frozen=True)
class Composite(Ast):
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

    def askNegated(self, kb:'KB')->'KB':
        from core.expbuilder import e
        x1=e(self.copy(negation=Int(False))).ask(kb)
        return x1 << (Int(not x1.head))