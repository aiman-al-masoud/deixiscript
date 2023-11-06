from typing import Dict, Sequence
from core.KB import KB
# from abc import abstractmethod

class Ast:

    def eval(self, kb:'KB')->'KB': raise Exception
    def askNegative(self, kb:'KB')->'KB': raise Exception
    def tellNegative(self, kb:'KB')->'KB': raise Exception
    def askPositive(self, kb:'KB')->'KB': raise Exception
    def tellPositive(self, kb:'KB')->'KB': raise Exception
    def define(self, kb:'KB')->'Ast': raise Exception
    def conseq(self, kb:'KB')->'Ast': raise Exception
    def copy(self, **kwargs:'Ast')->'Ast': raise Exception
    def isMatch(self, sub:'Ast')->Dict['Ast', 'Ast']: raise Exception
    def subst(self, map:Dict['Ast', 'Ast'])->'Ast': raise Exception
    def unroll(self)->Sequence['Ast']: raise Exception
    def isThingish(self)->bool: raise Exception
    def isNegative(self)->bool: raise Exception
    def isCmd(self)->bool: raise Exception
