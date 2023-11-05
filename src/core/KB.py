from dataclasses import dataclass
from functools import cmp_to_key
from typing import FrozenSet, Iterable, Tuple, TYPE_CHECKING, TypeVar
from core.DeicticDict import DeicticDict

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


T = TypeVar('T', bound='Ast')
def sortByGenerality(asts:Iterable[T]):
    x1 = sorted(asts, key=cmp_to_key(compareByGenerality))
    x2 = tuple(x1)
    return x2

def compareByGenerality(ast1:'Ast', ast2:'Ast')->int:
    return bool(ast1.isMatch(ast2)) - bool(ast2.isMatch(ast1))