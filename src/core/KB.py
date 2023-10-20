from dataclasses import dataclass
from typing import FrozenSet, Tuple
from core.DeicticDict import DeicticDict
from core.language import Ast, Law, Def
from core.sortByGenerality import sortByGenerality


WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = FrozenSet[WmSentence]

@dataclass(frozen=True)
class KB:
    wm:WorldModel             =frozenset()
    ds:Tuple[Def|Law, ...]    =tuple()
    dd:DeicticDict            =DeicticDict()

    def __lshift__(self, o:Ast)->'KB':
        return KB(self.wm, self.ds, self.dd.update(o))

    def __add__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset(): 
                return KB(self.wm | o, self.ds, self.dd)
            case Def()|Law():
                ds = sortByGenerality([*self.ds, o])
                return KB(self.wm, ds, self.dd)

    def __sub__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset():
                return KB(self.wm - o, self.ds, self.dd)
            case Def()|Law():
                raise Exception()

    @property
    def defs(self): 
        return (x for x in self.ds if isinstance(x, Def))
    
    @property
    def laws(self): 
        return (x for x in self.ds if isinstance(x, Law))

    @property
    def head(self)->'Ast':
        return self.dd.latest
    