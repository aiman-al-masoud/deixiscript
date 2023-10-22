from core.composite import Composite
from core.explicit import Explicit, Str

Ast = Explicit | Composite

GAP=Str('_')
'''linguistic gap denoting the empty noun-phrase'''
