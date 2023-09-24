from dataclasses import dataclass
from typing import Callable, Generic, TypeVar, overload
from language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Negation, Noun, Numerality, SimpleSentence, Which
from KnowledgeBase import KnowledgeBase


_=''    
'''linguistic gap denoting the empty noun-phrase'''

T=TypeVar('T', bound='Ast')

@dataclass(frozen=True)
class ExpBuilder(Generic[T]):

    e:T

    def binop(self, op:Ast, right:'Ast|ExpBuilder'):
        return ExpBuilder(BinExp(op, self.e, makeAst(right)))

    def equals(self, x:'Ast|ExpBuilder'):
        return self.binop('=', x)

    def and_(self, x:'Ast|ExpBuilder'):
        return self.binop('and', x)
    
    def or_(self, x:'Ast|ExpBuilder'):
        return self.binop('or', x)
    
    def plus(self, x:'ExpBuilder'):
        return self.binop('+', x)

    def verbSen(self, verb:'Ast|ExpBuilder', negation:bool):
        return ExpBuilder(SimpleSentence(makeAst(verb), self.e, negation=negation))

    def does(self, verb:'Ast|ExpBuilder'):        
        return self.verbSen(verb, False)

    def does_not(self, verb:'Ast|ExpBuilder'):
        return self.verbSen(verb, True)

    def complement(self, name:str, thing:'Ast|ExpBuilder'):
        if not isinstance(self.e, SimpleSentence): raise Exception()

        #TODO: copyAst dedup
        v = SimpleSentence(**{**self.e.__dict__, name : makeAst(thing)})
        return ExpBuilder(v)
        

    def _(self, object:'Ast|ExpBuilder'): return self.complement('object', object)
    def as_(self, as_:'Ast|ExpBuilder'): return self.complement('as_', as_)
    def to(self, to:'Ast|ExpBuilder'): return self.complement('to', to)
    def on(self, on:'Ast|ExpBuilder'): return self.complement('on', on)

    def which(self, which:'Ast|ExpBuilder'):
        return ExpBuilder(Which(self.e, makeAst(which)))

    def when(self, definition:'Ast|ExpBuilder'):
        return ExpBuilder(AnalyticDerivation(self.e, makeAst(definition)))
    
    @property
    def idiom(self):
        return ExpBuilder(Idiom(self.e))

    def run(self, kb=KnowledgeBase.empty):
        from run import run
        return run(self.e, kb)

    def get(self, kb=KnowledgeBase.empty):
        return e(self.e).run(kb).head
        # return e(removeCommands(self.e)).run(kb).head
    
    def count(self, kb=KnowledgeBase.empty):
        r = self.get(kb)
        return len(r) if isinstance(r, tuple) else 1
    
    def tell(self, kb=KnowledgeBase.empty):
        return new(self.e).run(kb)

    def tellKb(self, kb=KnowledgeBase.empty):
        return self.tell(kb).kb
    
    @property
    def lin(self):
        from linearize import linearize
        return linearize(self.e)


def e(x:Ast|ExpBuilder):
    '''explicit'''
    return ExpBuilder(makeAst(x))

# def i(x:Ast):
#     '''implicit'''
#     return ExpBuilder(Noun(x))

def every(x:Ast):
    return ExpBuilder(Noun(x))

def does(v:Ast):
    return e(_).does(v)

def it_is_false_that(x:Ast|ExpBuilder):
    return ExpBuilder(Negation(makeAst(x)))

def makeAst(x:Ast|ExpBuilder)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|ExpBuilder):
    return ExpBuilder(Command(makeAst(x)))

@overload
def the(card:int)->Callable[[str], ExpBuilder]:...
@overload
def the(card:str)->ExpBuilder:...
def the(card:int|str)->Callable[[str], ExpBuilder]|ExpBuilder:

    match card:
        case int(x):
            return lambda s:ExpBuilder(Numerality(Noun(s), x, -1)) # WRONG: NUMERALITY SHOULD WRAP ALL OTHER NOUNPHRASES!!!!! 
        case str(x):
            return ExpBuilder(Noun(x))

# def removeCommands(x:Ast):
#     p = partial(subst, lambda x:isinstance(x, Command), lambda x: cast(Command, x).value)
#     y = p(x)
#     z = p(y)
#     return z

# .s in expbuilder to pluralize   the('cat').s
# the(1).th('cat') or the(1).st('cat')  

