from typing import Dict, Sequence
from core.Ast import Ast
from core.KB import KB

class Explicit(Ast):
    __slots__=()

    def eval(self, kb:'KB')->'KB':
        return kb << self

    def copy(self, **kwargs:'Ast'):
        return self

    def unroll(self)->Sequence['Ast']:
        return [self]

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        return {self:sub} if sub==self else {}

    def subst(self, map: Dict['Ast', 'Ast']) -> 'Ast':
        if self in map: return map[self]
        return self

    def isThingish(self) -> bool:
        return True

    def define(self, kb:'KB'):
        return self

    def isCmd(self) -> bool:
        return False

    def isNegative(self) -> bool:
        return False