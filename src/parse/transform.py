
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


# def toDict(st:Tree|Token|List[Tree], realtypes:Set[str]=set()):
#     match st:
#         case Token():
#             if st.isnumeric(): return int(st)
#             return str(st)
#         case Tree():
#             mytype=st.data.value
#             children=toDict(st.children, realtypes)
#             if mytype in realtypes: return {'type':mytype, **children}
#             return {mytype:children}
#         case [*xs]:
#             children= [toDict(x, realtypes) for x in xs]
#             if len(children)==1: return children[0]

#             big = {}

#             for c in children:
                
#                 if comm:=c.keys()&big:
#                     for k in comm: 
#                         big[k] = [big[k], c[k]]
#                     continue

#                 big = {**big, **c}

#             return big
            
# realtypes={'noun', 'relative', 'simple_sentence', 'compound_sentence'}

class ToDict(Transformer):

    def NUMBER(self, children):
        return int(children)

    def NAME(self, children):
        return str(children)

    def ord(self, children):
        return {'ord': children}

    def card(self, children):
        return {'card': children[0] if len(children)==1 else children }

    def negation(self, children):
        return {'negation':children}
    
    def noun_head(self, children):
        return {'noun_head':children}

    def relative_head(self, children):
        return {'relative_head':children}

    def subordinate(self, children):
        return {'subordinate':children}

    def noun(self, children):
        return {'type':'noun', **reduce(lambda a,b: {**a, **b}, children)}
    
    def complement_head(self, children):
        return {'complement_head':children}

    def preposition(self, children):
        return {'preposition':children}

    def complement(self, children):
        return {'type':'complement', **reduce(lambda a,b: {**a, **b}, children)}

    def cmd(self, children):
        return {'cmd': True}

    def relative(self, children):
        return {'type':'relative', **reduce(lambda a,b: {**a, **b}, children)}

    def subject(self, children):
        return {'subject': children}

    def object(self, children):
        return {'object': children}

    def verb(self, children):
        return {'verb': children}

    def simple_sentence(self, children):        
        return {'type':'simple_sentence', **reduce(lambda a,b: {**a, **b}, children)}

    def compound_sentence(self, children):
        pass

