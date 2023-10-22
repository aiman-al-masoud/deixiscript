from dataclasses import dataclass
from typing import FrozenSet, Tuple
from core.DeicticDict import DeicticDict
from core.language import Ast, Law, Def
from core.sortByGenerality import sortByGenerality


WorldModel = FrozenSet[Tuple['Ast', 'Ast', 'Ast']]

@dataclass(frozen=True)
class KB:
    wm:WorldModel             =frozenset()
    defs:Tuple['Def', ...]    =tuple()
    laws:Tuple['Law', ...]    =tuple()
    dd:DeicticDict            =DeicticDict()

    def copy(self, **kwargs):
        return KB(**{**self.__dict__, **kwargs})

    def __lshift__(self, o:'Ast'):
        return self.copy(dd=self.dd.update(o))

    def __add__(self, o:'WorldModel|Def|Law'):
        match o:
            case frozenset(): 
                return self.copy(wm=self.wm | o)
            case Def():
                return self.copy(defs=sortByGenerality([*self.defs, o]))
            case Law():
                return self.copy(laws=sortByGenerality([*self.laws, o]))

    def __sub__(self, o:'WorldModel|Def|Law'):
        match o:
            case frozenset():
                return self.copy(wm=self.wm - o)
            case Def()|Law():
                raise Exception()

    @property
    def head(self):
        return self.dd.latest