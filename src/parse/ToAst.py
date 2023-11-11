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

    def STRING(self, c):
        return Str(str(c).strip('"'))

    def NUMBER(self, c):
        return Int(c)

    def NAME(self, children):
        return Str(children)

    # def ord(self, children):
    #     return {'ord': children[0]}

    def card(self, children):
        return {'card': children[0]}

    def NEGATION(self, _):
        return {'negation': Bool(1)}

    def cmd(self, _):
        return {'cmd': Bool(1)}

    def noun_cmd(self, _):
        return {'cmd': Bool(1)}

    def verb(self, children):
        return {'verb': children[0]}
    
    def noun_head(self, children):
        return {'head':children[0]}

    def complement_head(self, children):
        return {'complement_head':children[0]}

    def subject(self, children):
        return {'subject': children[0]}

    def object(self, children):
        return {'object': children[0]}

    def noun_adjective(self, cs):
        noun=cs[1]
        adjective=cs[0]
        assert isinstance(adjective, Adjective)
        assert isinstance(noun, Implicit)
        return noun.addWhich(e(Str.GAP).does('be')._(the(adjective.value)).e)


    def noun_ordinal(self, cs):
        noun=cs[1]
        ordinal=Str(str(cs[0]))
        assert isinstance(noun, Implicit)
        if ordinal=='new': return noun.copy(cmd=Bool(True))
        return noun.copy(ord=ordinal)



    def noun_complement(self, cs):
        noun=cs[0]
        complement=list(cs[1].items())
        assert isinstance(noun, Implicit)
        return noun.addWhich(adaptComplement(complement[0][0], complement[0][1]).e)

    def noun_negation(self, cs):
        noun=cs[1]
        assert isinstance(noun, Implicit)
        return noun.copy(negation=Bool(1))

    def noun(self, children):        
        d=reduce(lambda a,b: {**a, **b}, [x for x in children if not isinstance(x, Adjective)])
        noun=Implicit(**d)
        return noun
        
    def noun_relative(self, cs):
        noun=cs[0]
        sentence=cs[1].copy(cmd=Bool(0))
        assert isinstance(noun, Implicit)
        return noun.addWhich(sentence)

    def complement(self, children):
        preposition=str([x for x in children if isinstance(x, Token)][0])
        value=[x for x in children if isinstance(x, Ast)][0]
        return {preposition:value}

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