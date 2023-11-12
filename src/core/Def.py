from dataclasses import dataclass
from core.Bool import Bool
from core.Composite import Composite
from typing import Dict
from core.Ast import Ast
from core.KB import KB


@dataclass(frozen=True, repr=False)
class Def(Composite):
    definendum:'Ast'=Bool(False)
    definition:'Ast'=Bool(False)
    
    def tellPositive(self, kb:'KB')->'KB':
        return kb + self

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        if not isinstance(sub, Def): return {}
        return self.definendum.isMatch(sub.definendum)

    def isThingish(self) -> bool:
        return False

    def define(self, kb: 'KB') -> 'Ast':
        # return super().define(kb)
        definendum=self.definendum.define(kb-self)
        definition=self.definition.define(kb-self)
        result=self.copy(definendum=definendum, definition=definition)
        return result