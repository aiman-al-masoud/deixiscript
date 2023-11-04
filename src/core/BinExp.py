from dataclasses import dataclass
from core.Composite import Composite
from typing import Dict, Sequence
from core.Ast import Ast
from core.Str import Str
from core.Int import Int
from core.KB import KB


@dataclass(frozen=True)
class BinExp(Composite):
    op:'Ast'    =Int(False)
    left:'Ast'  =Int(False)
    right:'Ast' =Int(False)
        
    def askPositive(self, kb:'KB')->'KB':

        match self.op:

            case Str('and'|'or') if self.isThingish():
                left = self.left.eval(kb)
                right= self.right.eval(left)
                return right << self.copy(left=left.it, right=right.it)
            case Str('and'):
                r1 = self.left.eval(kb)
                if not r1.it: return r1
                r2 = self.right.eval(r1)
                return r2
            case Str('or'):
                r1 = self.left.eval(kb)
                if r1.it: return r1
                r2 = self.right.eval(r1)
                return r2
            case Str('+'|'-'|'*'|'/'):
                return mathOp(self.op, self.left, self.right, kb)

        raise Exception
    
    def tellPositive(self, kb:'KB')->'KB':
        x1 = self.left.copy(cmd=Int(1)).eval(kb)
        x2 = self.right.copy(cmd=Int(1)).eval(x1 << kb.it)
        return x2

    def unroll(self)->Sequence['Ast']:
        x1 = self.left.unroll()
        x2 = self.right.unroll() 
        return [*x1, *x2]

    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:

        from core.someMap import everyMap, someMap

        match self.op:
            case 'and':
                return everyMap(self.left.isMatch(sub), self.right.isMatch(sub))
            case 'or':
                return someMap(self.left.isMatch(sub), self.right.isMatch(sub))
        
        return {}

    def isThingish(self) -> bool:
        if self.op not in {'and', 'or'}: return True
        return self.left.isThingish() and self.right.isThingish()

    # def __add__(self, o:Ast):
    #     return sum(self.unroll())+o

def mathOp(op:str, left:Ast, right:Ast, kb:KB):
    from core.EB import e
    l = left.eval(kb)
    r = right.eval(l)

    # assert isinstance(l.it, Int|BinExp) and isinstance(r.it, Int)
    assert isinstance(l.it, Int) and isinstance(r.it, Int)
    # TODO: 1 and 2 and 3 + 0 = 6

    match op:
        case '+': result = l.it + r.it
        case '-': result = l.it - r.it
        case '*': result = l.it * r.it
        case '/': result = l.it / r.it
        case _: raise Exception
    
    result1 = Int(result)
    kb1 = e(result1).reallyIs('number').tell(kb)
    return kb1 << result1