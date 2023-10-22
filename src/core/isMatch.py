from functools import reduce
from typing import Dict, Optional
from core.language import Ast, BinExp, Explicit, Implicit, Law, Str
from core.explicit import Int
from core.simplesentence import SimpleSentence
from core.Def import Def

def isMatch(sub:Ast, sup:Ast)->Optional[Dict[Ast, Ast]]:

    match sub, sup:
        case Explicit(), Explicit():
            return {sup:sub} if sub==sup else None

        case Implicit(), Implicit():
            # if sup.card > sub.card: return False

            ok = everyone(isMatch(sub.head, sup.head), isMatch(sub.which, sup.which))
            return {sup:sub} if ok else None

        case SimpleSentence(), SimpleSentence():
            sub_keys=sub.args.keys()
            sup_keys=sup.args.keys()
            com_keys=sub_keys&sup_keys
            if com_keys!=sup_keys: return None
            return everyone(*[isMatch(sub.args[k], sup.args[k]) for k in com_keys])

        case BinExp(op=Str('and')), SimpleSentence():
            return someone(isMatch(sub.left, sup), isMatch(sub.right, sup))           

        case SimpleSentence(), BinExp(op=Str('and')):
            return everyone(isMatch(sub, sup.left), isMatch(sub, sup.right))

        case BinExp(op=Str('and')), SimpleSentence():
            raise Exception()

        case SimpleSentence(), BinExp(op=Str('or')):
            return someone(isMatch(sub, sup.left), isMatch(sub, sup.right))

        # case BinExp(op='and'|'or'), BinExp(op='and'|'or'):
        #     raise Exception()

        case Def(definendum=d1), Def(definendum=d2):
            return isMatch(d1, d2)

        case Law(cause=c1), Law(cause=c2):
            return isMatch(c1, c2)

        case _, Int(1):
            return {Int(True):sub}

        case _:
            return None

def someone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps=[m for m in maps if m]
    if not okMaps: return None
    return okMaps[0]

def everyone(*maps:Dict[Ast, Ast]|None)->Optional[Dict[Ast, Ast]]:
    okMaps = [m for m in maps if m]
    if len(okMaps)!=len(maps): return None
    return reduce(lambda a,b: {**a, **b}, okMaps)