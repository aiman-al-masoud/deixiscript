from typing import TYPE_CHECKING, Dict, Optional, Sequence

if TYPE_CHECKING:
    from core.KB import KB

class Ast:
    def eval(self, kb:'KB')->'KB': raise Exception
    def askNegative(self, kb:'KB')->'KB': raise Exception
    def tellNegative(self, kb:'KB')->'KB': raise Exception
    def askPositive(self, kb:'KB')->'KB': raise Exception
    def tellPositive(self, kb:'KB')->'KB': raise Exception
    def define(self, kb:'KB')->'Ast': raise Exception
    def conseq(self, kb:'KB')->Optional['Ast']: raise Exception
    def copy(self, **kwargs:'Ast')->'Ast': raise Exception
    def isMatch(self, sub:'Ast')->Optional[Dict['Ast', 'Ast']]: raise Exception
    def subst(self, map:Dict['Ast', 'Ast'])->'Ast': raise Exception
    def unroll(self)->Sequence['Ast']: raise Exception