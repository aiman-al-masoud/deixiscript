from typing import TYPE_CHECKING, Dict, Optional, Sequence
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB

class Explicit(Ast):
    __slots__=()

    def eval(self, kb:'KB')->'KB':
        return kb << self

    def ask(self, kb: 'KB') -> 'KB':
        return kb
        
    def tell(self, kb: 'KB') -> 'KB':
        return kb

    def copy(self, **kwargs:'Ast'):
        return self

    def unroll(self)->Sequence['Ast']:
        return [self]

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        return {self:sub} if sub==self else None

    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self in map: return map[self]
        return self
    
    # def define(self, kb:'KB')->'Ast':
    #     return self

