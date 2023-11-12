from dataclasses import dataclass
from functools import reduce
from typing import Tuple
from core.Ast import Ast
from core.KB import KB

@dataclass(frozen=True)
class Paragraph(Ast):
    statements:Tuple[Ast, ...]
    
    def eval(self, kb: 'KB') -> 'KB':
        kb1=reduce(lambda a,b: b.eval(a), self.statements,  kb)
        return kb1
