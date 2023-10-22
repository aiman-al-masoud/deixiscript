from dataclasses import dataclass
from core.explicit import Int
from typing import TYPE_CHECKING, Dict
if TYPE_CHECKING:
    from core.language import Ast
    from core.KB import KB 

@dataclass(frozen=True)
class SimpleSentence:
    verb:'Ast'
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

    def eval(self, kb:'KB')->'KB':
        raise Exception()

    def ask(self, kb:'KB')->'KB':
        raise Exception()
    
    def tell(self, kb:'KB')->'KB':
        raise Exception()
