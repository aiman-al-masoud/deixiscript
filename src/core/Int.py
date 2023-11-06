
from core.Explicit import Explicit


class Int(int, Explicit):

    def __bool__(self) -> bool:
        return True