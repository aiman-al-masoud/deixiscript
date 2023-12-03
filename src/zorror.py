
from dataclasses import dataclass

@dataclass(frozen=True)
class Zorror:
    msg:str
    # row:, col:,
    def __bool__(self): return False
    # because


