from dataclasses import dataclass
from functools import reduce
from lark import Token, Transformer
from core.Ast import Ast
from core.Bool import Bool
from core.Implicit import Implicit
from core.Int import Int
from core.SimpleSentence import SimpleSentence
from core.Str import Str
from core.EB import e, the

class ToAst(Transformer):

    def adjective(self, cs):
        return Adjective(str(cs[0]).rstrip('ful'))

    def string(self, children):
        return Str(str(children[0]).strip('"'))

    def NUMBER(self, children):
        return Int(children)

    def NAME(self, children):
        return Str(children)

    def PREPOSITION(self, children):
        return Str(children)

    def ord(self, children):
        return {'ord': children[0]}

    def number(self, children):
        return children[0]

    def card(self, children):
        return {'card': children[0]}

    def negation(self, _):
        return {'negation': Bool(1)}

    def cmd(self, _):
        return {'cmd': Bool(1)}

    def noun_cmd(self, _):
        return {'cmd': Bool(1)}

    def verb(self, children):
        return {'verb': children[0]}
    
    def noun_head(self, children):
        return {'head':children[0]}

    def relative_head(self, children):
        return {'head':children[0]}

    def subordinate(self, children):
        return {'which':children[0]}

    def complement_head(self, children):
        return {'complement_head':children[0]}

    def preposition(self, children):
        return {'preposition':children[0]}

    def subject(self, children):
        return {'subject': children[0]}

    def object(self, children):
        return {'object': children[0]}

    def noun(self, children):
        
        adjs1=[the(str(x.value)) for x in children if isinstance(x, Adjective)]
        adjs2=[e(Str.GAP).does('be')._(x) for x in adjs1]
        adjs3 = reduce(lambda a,b:a.and_(b), adjs2).e if adjs2 else Bool(True)
        d=reduce(lambda a,b: {**a, **b}, [x for x in children if not isinstance(x, Adjective)])

        coreKeys={'head', 'which', 'card', 'ord', 'negation', 'cmd'}
        core={k:v for k,v in d.items() if k in coreKeys}
        comps={k:v for k,v in d.items() if k not in coreKeys}
        noun=Implicit(**core)

        comps1 = [adaptComplement(p, t) for p,t in comps.items()]
        comps2 = reduce(lambda a,b:a.and_(b), comps1).e if comps1 else Bool(True)

        which = adjs3 if noun.which==Bool(True) else e(noun.which).and_(adjs3)
        which2 = comps2 if comps2!=Bool(True) and which==Bool(True) else  e(which).and_(comps2) if comps2!=Bool(True) else which

        result = e(noun).which(which2).e
        return result
        
    def relative(self, children):
        # TODO add subject and object if absent??
        d=reduce(lambda a,b: {**a, **b}, children)
        return d['head'].copy(which=d['which'].copy(cmd=Bool(0)))

    def complement(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        preposition= 'as_' if d['preposition']=='as' else d['preposition']
        head=d['complement_head']
        return {preposition:head}

    def simple_sentence(self, children):
        d=reduce(lambda a,b: {**a, **b}, children)
        x1=SimpleSentence(**d)
        x2=x1.copy(subject= x1.subject or Str.GAP)
        return x2

    def compound_sentence(self, cs):
        op=str([x for x in cs if isinstance(x, Token)][0])
        match op:
            case 'when': return e(cs[0]).when(cs[2]).e.copy(cmd=Bool(1))
            case 'after': return e(cs[0]).after(cs[2]).e.copy(cmd=Bool(1))
            case _: return e(cs[0]).binop(op, cs[2]).e


def adaptComplement(prepo:str, thing:Implicit):

    if prepo=='of':
        return e(thing).does('have')._(Str.GAP).as_('attribute')

    raise Exception

@dataclass
class Adjective:
    value:str

# @dataclass
# class Complement:
#     preposition:str
#     value:Ast