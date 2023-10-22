from functools import reduce
from typing import Dict, Optional
from core.language import Ast 

def isMatch(sub:Ast, sup:Ast)->Optional[Dict[Ast, Ast]]:
    return sup.isMatch(sub)

def someone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps=[m for m in maps if m]
    if not okMaps: return None
    return okMaps[0]

def everyone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps = [m for m in maps if m]
    if len(okMaps)!=len(maps): return None
    return reduce(lambda a,b: {**a, **b}, okMaps)