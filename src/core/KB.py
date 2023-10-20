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
    defs:Tuple[Def, ...]      =tuple()
    laws:Tuple[Law, ...]      =tuple()
    dd:DeicticDict            =DeicticDict()

    def __lshift__(self, o:Ast)->'KB':
        return KB(self.wm, self.defs, self.laws, self.dd.update(o))

    def __add__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset(): 
                return KB(self.wm | o, self.defs, self.laws, self.dd)
            case Def():
                return KB(self.wm, sortByGenerality([*self.defs, o]), self.laws, self.dd)
            case Law():
                return KB(self.wm, self.defs, sortByGenerality([*self.laws, o]), self.dd)

    def __sub__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset():
                return KB(self.wm - o, self.defs, self.laws, self.dd)
            case Def()|Law():
                raise Exception()

    @property
    def head(self)->'Ast':
        return self.dd.latest