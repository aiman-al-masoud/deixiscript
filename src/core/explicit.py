from typing import TYPE_CHECKING, Sequence

if TYPE_CHECKING:
    from core.KB import KB
    from core.language import Ast

class Explicit():
    __slots__=()

    def eval(self, kb:'KB')->'KB':
        return kb << self

    # def ask(self, kb:'KB')->'KB':
    #     raise Exception()
    
    # def tell(self, kb:'KB')->'KB':
    #     raise Exception()

    def copy(self, **kwargs:'Ast'):
        return self

    def unroll(self)->Sequence['Ast']:
        return [self]

class Str(str, Explicit):
    pass

class Int(int, Explicit):
    pass