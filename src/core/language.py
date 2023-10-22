from typing import TYPE_CHECKING, Sequence

if TYPE_CHECKING:
    from core.KB import KB

class Ast:
    def copy(self, **kwargs)->'Ast': raise Exception()
    def eval(self, kb:'KB')->'KB': raise Exception()
    def unroll(self)->Sequence['Ast']: raise Exception()
