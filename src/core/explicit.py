from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from core.KB import KB

class Explicit():
    __slots__=()

    def eval(self, kb:'KB')->'KB':
        raise Exception()

    def ask(self, kb:'KB')->'KB':
        raise Exception()
    
    def tell(self, kb:'KB')->'KB':
        raise Exception()

class Str(str, Explicit):
    pass

class Int(int, Explicit):
    pass