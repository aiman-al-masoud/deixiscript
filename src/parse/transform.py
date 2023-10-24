
# from typing import List
# from lark import Lark, Transformer, Tree

# from core.expbuilder import e

# class BurufTransformer(Transformer):

#     def NUMBER(self, tok):
#         return tok.update(value=int(tok))

#     def noun(self, children:List[Tree]):
#         print('children=', children)

#         return e(1)

from functools import reduce
from typing import List, Set
from lark import Lark, Token, Transformer, Tree

from core.expbuilder import every


def toDict(st:Tree|Token|List[Tree], realtypes:Set[str]=set()):
    match st:
        case Token():
            if st.isnumeric(): return int(st)
            return str(st)
        case Tree():
            mytype=st.data.value
            children=toDict(st.children, realtypes)
            if mytype in realtypes: return {'type':mytype, **children}
            return {mytype:children}
        case [*xs]:
            children= [toDict(x, realtypes) for x in xs]
            if len(children)==1: return children[0]

            big = {}

            for c in children:
                
                if comm:=c.keys()&big:
                    for k in comm: 
                        big[k] = [big[k], c[k]]
                    continue

                big = {**big, **c}

            return big
            


