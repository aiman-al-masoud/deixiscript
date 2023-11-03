from dataclasses import dataclass
from typing import FrozenSet, Tuple, TYPE_CHECKING
from core.DeicticDict import DeicticDict
from core.sortByGenerality import sortByGenerality

if TYPE_CHECKING:
    from core.Ast import Ast
    from core.Def import Def
    from core.Law import Law

WorldModel = FrozenSet[Tuple['Ast', 'Ast', 'Ast']]

@dataclass(frozen=True)
class KB:
    wm:WorldModel             =frozenset()
    defs:Tuple['Def', ...]    =tuple()
    laws:Tuple['Law', ...]    =tuple()
    dd:DeicticDict['Ast']     =DeicticDict()
    concept:bool              =False

    def copy(self, **kwargs):
        return KB(**{**self.__dict__, **kwargs})

    def __lshift__(self, o:'Ast'):
        return self.copy(dd=self.dd.update(o))

    def __add__(self, o:'WorldModel|Def|Law'):
        from core.Def import Def
        from core.Law import Law

        match o:
            case frozenset(): 
                return self.copy(wm=self.wm | o)
            case Def():
                return self.copy(defs=sortByGenerality([*self.defs, o]))
            case Law():
                return self.copy(laws=sortByGenerality([*self.laws, o]))

    def __sub__(self, o:'WorldModel|Def|Law'):
        from core.Def import Def
        from core.Law import Law

        match o:
            case frozenset():
                return self.copy(wm=self.wm - o)
            case Def()|Law():
                raise Exception

    @property
    def it(self):
        from core.Int import Int
        return self.dd.latest(Int(False))