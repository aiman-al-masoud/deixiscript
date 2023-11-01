from typing import TYPE_CHECKING, Dict
from dataclasses import dataclass
from core.BinExp import BinExp
from core.Composite import Composite
from core.Int import Int
from core.Str import Str
from core.Ast import Ast

if TYPE_CHECKING:
    from core.KB import KB 

@dataclass(frozen=True)
class SimpleSentence(Composite):
    verb:'Ast'    =Int(False)
    subject:'Ast' =Int(False)
    object:'Ast'  =Int(False)
    as_:'Ast'     =Int(False)
    to:'Ast'      =Int(False)
    on:'Ast'      =Int(False)

    def isThingish(self) -> bool:
        return False

    @property
    def args(self)->Dict[str, 'Ast']:
        x1 = [(k,v) for k,v in vars(self).items() if v] # non-falsy
        x2 = [(k,v) for k,v in x1 if k not in {'negation', 'cmd'}]
        x3 = dict(x2)
        return x3

    def askPositive(self, kb:'KB')->'KB':
        from core.expbuilder import e
        
        match self:
            case SimpleSentence(verb=Str('be')):
                if self.object == 'thing': return kb << Int(True)
                return e(self.subject).does('have')._(self.object).as_('super').eval(kb)
            case SimpleSentence() if self.verb!='have':
                event = makeEvent(self)
                return event.eval(kb)
            case SimpleSentence(verb=Str('have')):
                x1 = makeExplicit(self, kb)
                if x1.it!=self: return x1.it.eval(x1)
                x=(self.subject,self.object,self.as_)
                return kb << Int(x in kb.wm)
                
        raise Exception
        
    
    def tellPositive(self, kb:'KB')->'KB':
        from core.expbuilder import e

        # TODO: meta-command switch modes conceptual/world

        match self:
        
            case SimpleSentence(verb=Str('be')):
                return e(self.subject).does('have')._(self.object).as_('super').tell(kb)
            case SimpleSentence() if self.verb!='have':
                event = makeEvent(self)
                old   = event.eval(kb)
                if old.it: return old
                return event.copy(cmd=Int(1)).eval(kb)
            case SimpleSentence(verb=Str('have')):
                x1 = makeExplicit(self, kb)
                if x1.it !=self: return x1.it.copy(cmd=Int(1)).eval(x1)
                x = (self.subject, self.object, self.as_)
                delta = frozenset({x})
                kb1   = kb + delta
                return kb1
        
        raise Exception

        
    def isMatch(self, sub: 'Ast') -> Dict['Ast', 'Ast']:
        from core.isMatch import everyMap, someMap

        match sub:
            case SimpleSentence():
                sub_keys=sub.args.keys()
                sup_keys=self.args.keys()
                com_keys=sub_keys&sup_keys
                if com_keys!=sup_keys: return {}
                return everyMap(*[self.args[k].isMatch(sub.args[k]) for k in com_keys])
            case BinExp(op='and'|'or'):
                return someMap(self.isMatch(sub.left), self.isMatch(sub.right))
        
        return {}


def makeEvent(ast:SimpleSentence):
    from core.expbuilder import does, every
    from functools import reduce

    x1 = ast.args.items()
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def makeExplicit(ast:SimpleSentence, kb:'KB')->'KB':
    from core.decompress import decompress

    assert ast.verb=='have'

    # the following ops may create new entities, return KB needed
    x1=ast.subject.eval(kb)
    x2=ast.object.eval(x1)
    x3=ast.as_.eval(x2)

    x4=ast.copy(subject=x1.it, object=x2.it, as_=x3.it)
    x5=decompress(x4)
    return x3 << x5
