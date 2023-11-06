from typing import Dict, Sequence
from core.Explicit import Explicit
from core.Ast import Ast

class Bool(int, Explicit):

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        if self==True: return {self:sub}
        return super().isMatch(sub)
    
    def unroll(self) -> Sequence['Ast']:
        if self==False: return []
        return super().unroll()