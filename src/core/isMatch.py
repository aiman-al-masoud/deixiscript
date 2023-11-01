from functools import reduce
from typing import Dict, Optional
from core.Ast import Ast 

def someMap(*maps:Dict[Ast, Ast])->Dict[Ast, Ast]:
    okMaps=[m for m in maps if m]
    if not okMaps: return {}
    return okMaps[0]

def everyMap(*maps:Dict[Ast, Ast])->Dict[Ast, Ast]:
    okMaps = [m for m in maps if m]
    if len(okMaps)!=len(maps): return {}
    return reduce(lambda a,b: {**a, **b}, okMaps)