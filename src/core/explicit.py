from typing import TYPE_CHECKING, Dict, Optional, Sequence
from core.language import Ast

if TYPE_CHECKING:
    from core.KB import KB

class Explicit(Ast):
    __slots__=()

    def eval(self, kb:'KB')->'KB':
        return kb << self

    def copy(self, **kwargs:'Ast'):
        return self

    def unroll(self)->Sequence['Ast']:
        return [self]

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        return {self:sub} if sub==self else None

class Str(str, Explicit):
    
    @classmethod
    @property
    def GAP(cls):
        '''linguistic gap denoting the empty noun-phrase'''
        return Str('_')

class Int(int, Explicit):

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if self == True: return {self:sub}
        return super().isMatch(sub)