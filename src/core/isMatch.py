from functools import reduce
from typing import Dict, Optional
from core.language import Ast 

def someone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps=[m for m in maps if m]
    if not okMaps: return None
    return okMaps[0]

def everyone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps = [m for m in maps if m]
    if len(okMaps)!=len(maps): return None
    return reduce(lambda a,b: {**a, **b}, okMaps)