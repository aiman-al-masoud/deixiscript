from typing import TYPE_CHECKING, Dict, Optional
from dataclasses import dataclass
from core.binexp import BinExp
from core.composite import Composite
from core.explicit import Int, Str
from core.language import Ast

if TYPE_CHECKING:
    from core.KB import KB 

@dataclass(frozen=True)
class SimpleSentence(Composite):
    verb:'Ast'=Str('')
    subject:'Ast'=Int(False)
    object:'Ast'=Int(False)
    as_:'Ast'=Int(False)
    to:'Ast'=Int(False)
    on:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)

    @property
    def args(self)->Dict[str, 'Ast']:
        x1 = [(k,v) for k,v in vars(self).items() if v] # non-falsy
        x2 = [(k,v) for k,v in x1 if k not in {'negation', 'cmd'}]
        x3 = dict(x2)
        return x3

    def askPositive(self, kb:'KB')->'KB':
        from core.expbuilder import e
        from core.explicit import Str
        from core.decompress import isImplicitish
        
        match self:
            case SimpleSentence(verb=Str('be')):
                if self.object == 'thing': return kb << Int(True)
                return e(self.subject).does('have')._(self.object).as_('super').ask(kb)
            case SimpleSentence() if self.verb!='have':
                event = makeEvent(self)
                return e(event).ask(kb)
            case SimpleSentence(verb=Str('have')) if isImplicitish(self):
                x1 = makeExplicit(self, kb)
                return e(x1.head).ask(x1)
            case SimpleSentence(verb=Str('have')):
                x=(self.subject,self.object,self.as_)
                return kb << Int(x in kb.wm)
                
        raise Exception()
        
    
    def tellPositive(self, kb:'KB')->'KB':
        from core.expbuilder import e
        from core.explicit import Str
        from core.decompress import isImplicitish

        match self:
        
            case SimpleSentence(verb=Str('be')):
                return e(self.subject).does('have')._(self.object).as_('super').tell(kb)
            case SimpleSentence() if self.verb!='have':
                event = makeEvent(self)
                old   = e(event).ask(kb)
                if old.head: return old
                return e(event).tell(kb)
            case SimpleSentence(verb=Str('have')) if isImplicitish(self):
                x1 = makeExplicit(self, kb)            
                return e(x1.head).tell(x1)
            case SimpleSentence(verb=Str('have')):
                x = (self.subject, self.object, self.as_)
                delta = frozenset({x})
                kb1   = kb + delta
                return kb1
        
        raise Exception()

        
    def isMatch(self, sub: 'Ast') -> Optional[Dict['Ast', 'Ast']]:
        from core.isMatch import everyMap, someMap

        match sub:
            case SimpleSentence():
                sub_keys=sub.args.keys()
                sup_keys=self.args.keys()
                com_keys=sub_keys&sup_keys
                if com_keys!=sup_keys: return None
                return everyMap(*[  self.args[k].isMatch(sub.args[k]) for k in com_keys ])
            case BinExp(op='and'):
                return someMap( self.isMatch(sub.left), self.isMatch(sub.right)  )
            case BinExp(op='or'):
                raise Exception()


def makeEvent(ast:SimpleSentence):
    from core.expbuilder import does, every
    from functools import reduce

    x1 = ast.args.items()
    x2 = [does('have')._(v).as_(k) for k,v in x1]
    x3 = reduce(lambda a,b:a.and_(b), x2)
    x4 = every('event').which(x3).e
    return x4

def makeExplicit(ast:SimpleSentence, kb:'KB')->'KB':
    from core.expbuilder import e
    from core.decompress import decompress

    assert ast.verb=='have'

    x1=e(ast.subject).ask(kb)
    x2=e(ast.object).ask(x1)
    x3=e(ast.as_).ask(x2)

    x4=ast.copy(subject=x1.head, object=x2.head, as_=x3.head)# subject=x1.head or ast.subject ...
    x5=decompress(x4)
    return x3 << x5
