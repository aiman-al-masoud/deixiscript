from dataclasses import dataclass
from lark import Token, Transformer
from core.Ast import Ast
from core.Bool import Bool
from core.Implicit import Implicit
from core.Int import Int
from core.Str import Str
from core.EB import e, the

class ToAst(Transformer):

    def ADJECTIVE(self, c): return Adjective(str(c).rstrip('ful'))
    def STRING(self, c): return Str(str(c).strip('"'))
    def NUMBER(self, c): return Int(c)
    def WORD(self, children):return Str(children)
    def NEGATION(self, _): return 'not'
    def QUESTION_MARK(self, _): return '?'
    def VERB(self, c): return Verb(c)
    def noun(self, cs): return Implicit(head=cs[0])        

    def noun_adjective(self, cs):
        noun=cs[1]
        adjective=cs[0]
        assert isinstance(adjective, Adjective)
        assert isinstance(noun, Implicit)
        return noun.addWhich(e(Str.GAP).does('be')._(the(adjective)).e) # TODO: rm the?

    def noun_cardinal(self, cs):
        noun=cs[1]
        cardinal=cs[0]
        assert isinstance(noun, Implicit)
        return noun.copy(card=cardinal)

    def noun_ordinal(self, cs):
        noun=cs[1]
        ordinal=Str(str(cs[0]))
        assert isinstance(noun, Implicit)
        if ordinal=='new': return noun.copy(cmd=Bool(True))
        return noun.copy(ord=ordinal)

    def noun_complement(self, cs):
        noun=cs[0]
        complement=cs[1]
        assert isinstance(noun, Implicit)
        return noun.addWhich(adaptComplement(complement.preposition, complement.value).e)

    def noun_negation(self, cs):
        noun=cs[1]
        assert isinstance(noun, Implicit)
        return noun.copy(negation=Bool(1))

    def noun_relative(self, cs):
        noun=cs[0]
        sentence=cs[1].copy(cmd=Bool(0))
        assert isinstance(noun, Implicit)
        return noun.addWhich(sentence)

    def complement(self, children):
        preposition=str([x for x in children if isinstance(x, Token)][0])
        value=[x for x in children if isinstance(x, Ast)][0]
        return Complement(preposition=preposition, value=value)

    def simple_sentence(self, cs):
        nouns=[x for x in cs if isinstance(x, Ast)]
        complements={x.preposition:x.value for x in cs if isinstance(x, Complement)}
        verb=[x for x in cs if isinstance(x, Verb)][0]
        subject=nouns[0] if nouns else Str.GAP
        object=nouns[1] if len(nouns)>1 else Bool(False)
        negation=Bool(any([x for x in cs if x=='not']))
        cmd=Bool(not any([x for x in cs if x=='?']))
        return e(subject).does(verb)._(object).e.copy(**complements, cmd=cmd, negation=negation)

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

class Adjective(str):
    pass

class Verb(str):
    pass

@dataclass
class Complement:
    preposition:str
    value:Ast