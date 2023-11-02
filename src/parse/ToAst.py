from functools import reduce
from lark import Transformer
from core.Implicit import Implicit
from core.Int import Int
from core.SimpleSentence import SimpleSentence
from core.Str import Str
from core.EB import e

class ToAst(Transformer):

    def NUMBER(self, children):
        return Int(children)

    def NAME(self, children):
        return Str(children)

    def PREPOSITION(self, children):
        return Str(children)

    def BINOP(self, children):
        return Str(children)

    def ord(self, children):
        return {'ord': children[0]}

    def card(self, children):
        return {'card': children[0]}

    def negation(self, _):
        return {'negation': Int(1)}

    def cmd(self, _):
        return {'cmd': Int(1)}

    def noun_cmd(self, _):
        return {'cmd': Int(1)}

    def verb(self, children):
        return {'verb': children[0]}
    
    def noun_head(self, children):
        return {'head':children[0]}

    def relative_head(self, children):
        return {'head':children[0]}

    def subordinate(self, children):
        return {'which':children[0]}

    def noun(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        return Implicit(**d)
    
    def relative(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        # TODO add subject and object if absent??
        return d['head'].copy(which=d['which'].copy(cmd=Int(0)))

    def complement_head(self, children):
        return {'complement_head':children[0]}

    def preposition(self, children):
        return {'preposition':children[0]}

    def complement(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        preposition= 'as_' if d['preposition']=='as' else d['preposition']
        head=d['complement_head']
        return {preposition:head}

    def subject(self, children):
        return {'subject': children[0]}

    def object(self, children):
        return {'object': children[0]}

    def simple_sentence(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        x1=SimpleSentence(**d)
        x2=x1.copy(subject= x1.subject if x1.subject else Str.GAP) # TODO
        return x2

    def left(self, children):
        return {'left':children[0]}

    def right(self, children):
        return {'right':children[0]}

    def op(self, children):
        return {'op':children[0]}

    def compound_sentence(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)

        match d['op']:
            case 'when':
                return e(d['left']).when(d['right']).e.copy(cmd=Int(1))# TODO!
            case 'after':
                return e(d['left']).after(d['right']).e.copy(cmd=Int(1))# TODO!
            case _:
                return e(d['left']).binop(d['op'], d['right']).e

