
from typing import Dict, Optional
from core.Explicit import Explicit
from core.Ast import Ast

class Int(int, Explicit):

    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        if self == True: return {self:sub}
        return super().isMatch(sub)