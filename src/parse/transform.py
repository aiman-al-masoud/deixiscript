# from lark import ParseTree, Token, Tree
# from core.expbuilder import does, e, the
# from core.Ast import Ast

# def transform(st:ParseTree|Token)->Ast:


#     match st:

#         case Token():
#             return e(int(st) if st.isnumeric() else st).e
#         case Tree(data=Token('RULE','noun')):
#             # print('NOUN!', xs)    
#             print('CNOAUNDN!')
#             pass
#         case Tree(data=Token('RULE','relative')):
#             pass
#         case Tree(data=Token('RULE','simple_sentence')):
#             pass
#         case Tree(data=Token('RULE','compound_sentence')):
#             pass
#         # noun
#             # head
#             # card
#             # ord
#             # negation
#             # cmd
#         # relative
#             # head
#             # which
#         # simple_sentence
#             # verb
#             # subject
#             # object
#             # as
#             # to
#             # on
#             # negation
#             # cmd
#         # compound_sentence
#             # left
#             # right
#             # op




from typing import List
from lark import Lark, Transformer, Tree

from core.expbuilder import e

class BurufTransformer(Transformer):

    def NUMBER(self, tok):
        return tok.update(value=int(tok))

    def noun(self, children:List[Tree]):
        print('children=', children)

        return e(1)

    
