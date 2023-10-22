from core.binexp import BinExp
from core.composite import Composite
from core.explicit import Explicit, Str
from core.implicit import Implicit


NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | Composite

GAP=Str('_')
'''linguistic gap denoting the empty noun-phrase'''
