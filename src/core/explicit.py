from typing import TYPE_CHECKING, Sequence
from core.language import Ast

if TYPE_CHECKING:
    from core.KB import KB

class Explicit(Ast):
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
    
    @classmethod
    @property
    def GAP(cls):
        '''linguistic gap denoting the empty noun-phrase'''
        return Str('_')

class Int(int, Explicit):
    pass