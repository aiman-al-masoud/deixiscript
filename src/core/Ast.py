from typing import TYPE_CHECKING, Dict, Optional, Sequence

if TYPE_CHECKING:
    from core.KB import KB

class Ast:
    def copy(self, **kwargs:'Ast')->'Ast': raise Exception()
    def eval(self, kb:'KB')->'KB': raise Exception()
    def isMatch(self, sub:'Ast')->Optional[Dict['Ast', 'Ast']]: raise Exception()
    def subst(self, map:Dict['Ast', 'Ast'])->'Ast': raise Exception()
    def unroll(self)->Sequence['Ast']: raise Exception()
