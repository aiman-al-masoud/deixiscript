from dataclasses import dataclass
import dataclasses
from zorror import Zorror
from functools import cmp_to_key, reduce
from typing import Callable, List, Tuple, TypeVar
from kb import KB


class Ast:
    def eval(self, kb:'KB')->'Tuple[KB, Constant]|Zorror': raise Exception(f'eval() not implemented in {self.__class__}')
    def english(self)->str: raise Exception(f'english() not implemented in {self.__class__}')

    T=TypeVar('T')
    def toggleCmd(self:T, cmd:bool)->T:
        newDict={k: v.toggleCmd(cmd) if isinstance(v, Ast) and 'cmd' in vars(v) else v for k,v in self.__dict__.items()}

        if 'cmd' in vars(self): 
            return self.__class__(**{**newDict, 'cmd':cmd})

        if dataclasses.is_dataclass(self):
            return self.__class__(**newDict) # pyright:ignore

        return self

    def ask(self): return self.toggleCmd(False)
    def tell(self): return self.toggleCmd(True)

class NounPhrase(Ast): pass

class Constant(NounPhrase):
    def eval(self, kb: 'KB'): return kb, self
    def english(self): return str(self)

class Id(Constant, int):
    def english(self): return 'ID#'+str(self)

class Num(Constant, float): pass

class Str(Constant, str): pass

@dataclass(frozen=True)
class Var(NounPhrase):
    name:str

@dataclass(frozen=True)
class Pronoun(NounPhrase):
    def english(self): return 'it'

@dataclass(frozen=True)
class Bool(Constant):
    value:bool
    def __bool__(self): return self.value
    def english(self): return 'true' if self else 'false'

@dataclass(frozen=True)
class Adjective(Ast):
    value:str
    negation:bool

    def check(self, kb: 'KB', subject:'NounPhrase') -> bool: #'Bool|Zorror':
        result=Idea(subject, self.value).ask().eval(kb)
        if isinstance(result, Zorror): return False
        return bool(result[1])!=self.negation

    def make(self, kb:'KB', subject:'NounPhrase')->'KB|Zorror':
        if self.negation: return kb
        result=Idea(subject, self.value, cmd=True).tell().eval(kb)
        if isinstance(result, Zorror): return result
        return result[0]

    def english(self): return ('non-' if self.negation else '')+self.value

@dataclass(frozen=True)
class ImplicitPhrase(NounPhrase):
    head:str
    adjectives:Tuple[Adjective, ...]=tuple()
    cmd:bool=False

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        if self.cmd:
            isAlreadyThere = not isinstance(self.ask().eval(kb), Zorror)
            if isAlreadyThere: return Zorror(f'{self.english()} already exists'.capitalize())
            kb1,newId=kb.create(self.head)
            kb2=reduce(
                lambda kb,adj: kb if isinstance(kb, Zorror) else adj.make(kb,  TypeCast(newId, self)  ), 
                self.adjectives, 
                kb1,
            )
            if isinstance(kb2, Zorror): return kb2
            return kb2.updateStm(self), newId
        else:
            headIds=[Id(i) for i, thing in enumerate(kb.wm) if thing['type']==self.head]
            if not headIds: return Zorror(f'Could not find any "{self.english()}.')
            adjIds=[i for i in headIds if all([a.check(kb, TypeCast(i, self)) for a in self.adjectives])]
            if not adjIds: return Zorror(f'Found some {self.head}, but no "{[x.english() for x in self.adjectives]}" ones.')
            if len(adjIds)==1: return kb.updateStm(self), adjIds[0]
            disambiguated=kb.disambiguate(self)
            if disambiguated is not None: return disambiguated.eval(kb)
            return Zorror(f'Found multiple: "{self.english()}", try specifying?')

    def english(self):
        adjectives=reduce(lambda a,b:a+b.english()+' ', self.adjectives, '')
        return 'a '+ adjectives + self.head

@dataclass(frozen=True)
class Genitive(NounPhrase):
    owner:NounPhrase
    prop:Constant

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':

        if isinstance(self.owner, Pronoun):
            return maybeDisambiguatePronoun(self, kb)
        else:
            maybe=self.owner.ask().eval(kb)
            if isinstance(maybe, Zorror): return maybe
            id=maybe[1]
            if not isinstance(id, Id): return Zorror(f"{self.owner} couldn't be resolved to an individual, only an individual can have properties (such as: '{self.prop}')")
            if not isinstance(self.prop, Str): return Zorror(f'{self.prop} cannot be used, only a constant string is allowed')
            prop=kb.getProp(id, self.prop)
            if isinstance(prop, Zorror): return Zorror(f'What did you mean by "{self.prop}" of {self.owner.english()}')
            return kb.updateStm(prop), prop
        
    def english(self): return self.owner.english() + "'s " + self.prop.english() 

def maybeDisambiguatePronoun(ast:Ast, kb:KB):
    from subst import subst
    for noun in kb.stm:
        disambiguated=subst(ast, {Pronoun() : noun})
        maybeResult=disambiguated.eval(kb)
        if not isinstance(maybeResult, Zorror): return maybeResult
    return Zorror(f'What does "it" mean in "{ast.english()}"?')

@dataclass(frozen=True)
class TypeCast(NounPhrase):
    value:Constant
    asType:NounPhrase

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        return kb, self.value
    
    def english(self): return self.value.english()+ " as " + self.asType.english()
 
@dataclass(frozen=True)
class BinExp(Ast):
    left:Ast
    right:Ast

@dataclass(frozen=True)
class LogExp(BinExp): pass

@dataclass(frozen=True)
class AndExp(LogExp):
    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        left=self.left.eval(kb)
        if isinstance(left, Zorror): return left
        if not left[1]: return kb, Bool(False)
        return self.right.eval(left[0])
    
    def english(self): return self.left.english() + " and " + self.right.english()

@dataclass(frozen=True)
class OrExp(LogExp):
    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        left=self.left.eval(kb)
        if isinstance(left, Zorror): return left
        if left[1]: return kb, Bool(True)
        return self.right.eval(left[0])

    def english(self): return self.left.english() + " or " + self.right.english()

@dataclass(frozen=True)
class ArithmeticExp(BinExp):
    def eval(self, kb: 'KB', compute:Callable[[Num, Num], float]) -> 'Tuple[KB, Constant]|Zorror':
        maybeLeft=self.left.eval(kb)
        maybeRight=self.right.eval(kb)
        if isinstance(maybeLeft, Zorror): return maybeLeft
        if isinstance(maybeRight, Zorror): return maybeRight
        left=maybeLeft[1]
        right=maybeRight[1]
        if not isinstance(left, Num) or not isinstance(right, Num): return Zorror(f'Cannot do math operation on "{left.english()}" and "{right.english()}", only on numbers')
        result=Num(compute(left, right))
        return kb.updateStm(result),result
        
@dataclass(frozen=True)
class AddExp(ArithmeticExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b:a+b)

@dataclass(frozen=True)
class SubExp(ArithmeticExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b:a-b)

@dataclass(frozen=True)
class MulExp(ArithmeticExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b:a*b)

@dataclass(frozen=True)
class DivExp(ArithmeticExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b:a/b)

@dataclass(frozen=True)
class EqExp(BinExp):
    cmd:bool=True
    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        if self.cmd:
            if not isinstance(self.left, Genitive): return Zorror(f'Cannot assign a value to "{self.left.english()}"')
            maybeOwner=self.left.owner.ask().eval(kb)
            if isinstance(maybeOwner, Zorror): return maybeOwner
            ownerId=maybeOwner[1]
            if not isinstance(ownerId, Id): return Zorror(f'What did you mean by {self.left.owner.english()}?')
            right=self.right.eval(kb)
            if isinstance(right, Zorror): return right
            if not isinstance(self.left.prop, Str): return Zorror(f'What is this property: "{self.left.prop}"? It must be a constant string')
            return kb.setProp(ownerId, self.left.prop, right[1]), right[1]
        else:
            left=self.left.ask().eval(kb)
            right=self.right.ask().eval(kb)
            if isinstance(left, Zorror): return left
            if isinstance(right, Zorror): return right            
            return kb, Bool(left[1]==right[1])

@dataclass(frozen=True)
class NeExp(BinExp):
    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        result=EqExp(self.left, self.right).ask().eval(kb)
        if isinstance(result, Zorror): return result
        return kb, Bool(not bool(result[1]))

@dataclass(frozen=True)
class CompareExp(BinExp):
    def eval(self, kb: 'KB', check:Callable[[Num, Num], bool]) -> 'Tuple[KB, Constant]|Zorror':
        maybeLeft=self.left.ask().eval(kb)
        maybeRight=self.right.ask().eval(kb)
        if isinstance(maybeLeft, Zorror): return maybeLeft
        if isinstance(maybeRight, Zorror): return maybeRight
        left=maybeLeft[1]
        right=maybeRight[1]
        if not isinstance(left, Num): return Zorror(f'Cannot compare "{left.english()}" it is not a  number')
        if not isinstance(right, Num): return Zorror(f'Cannot compare "{right.english()}" it is not a  number')
        return kb, Bool(check(left, right))

@dataclass(frozen=True)
class GtExp(CompareExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b: a>b)

@dataclass(frozen=True)
class LtExp(CompareExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b: a<b)

@dataclass(frozen=True)
class LteExp(CompareExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b: a<=b)

@dataclass(frozen=True)
class GteExp(CompareExp):
    def eval(self, kb: 'KB'): return super().eval(kb, lambda a,b: a>=b)

@dataclass(frozen=True)
class Idea(Ast):
    subject:NounPhrase
    predicate:str
    object:NounPhrase=Bool(False)
    cmd:bool=True

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        if isinstance(self.subject, Pronoun): 
            return maybeDisambiguatePronoun(self, kb)
        if isinstance(self.object, Pronoun): 
            return maybeDisambiguatePronoun(self, kb)
        from match import match
        from subst import subst
        definition=None
        for d in kb.defs:
            m=match(d.definendum, self)
            if m:
                definition = subst(d.definition, m)
                break

        if not definition: return Zorror(f'What does "{self.predicate}" mean for "{self.subject.english()}"{(" and "+self.object.english() if self.object else "")}?')
        return definition.toggleCmd(self.cmd).eval(kb)

    def english(self):
        engIdea = self.subject.english() + ' ' + self.predicate + " " + (self.object.english() if self.object else '') + ( '?' if not self.cmd else '')
        return engIdea.strip()

def maybeOrphanedProps(ast:Ast)->List[ImplicitPhrase|Str]:
    if not isinstance(ast, Ast): return []
    if isinstance(ast, Genitive): return []
    if isinstance(ast, ImplicitPhrase|Str): return [ast]
    return [y for x in vars(ast).values() for y in maybeOrphanedProps(x)]

def makeGenitive(owner:NounPhrase, prop:ImplicitPhrase|Str):
    if isinstance(prop, ImplicitPhrase): return Genitive(owner, Str(prop.head))
    return Genitive(owner, prop)

@dataclass(frozen=True)
class Def(Ast):
    definendum:Idea
    definition:Ast

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        from match import match
        from subst import subst
        orphanedProps=[p for p in maybeOrphanedProps(self.definition) 
                                if p not in [self.definendum.subject, self.definendum.object]]
        if isinstance(self.definendum.object, ImplicitPhrase) and orphanedProps: 
            return Zorror(f'Did the properties "{[x.english() for x in orphanedProps]}" refer to {self.definendum.subject.english()} or {self.definendum.object.english()}?')
        newDef=subst(
            self, 
            {p: makeGenitive(self.definendum.subject, p) for p in orphanedProps},
        )
        # subst(newDef, {Pronoun():self.definendum.subject})
        newDefs=(*kb.defs, newDef)
        def compareFun(a,b): return bool(match(a,b)) - bool(match(b,a))
        sortedDefs=sorted(newDefs, key=cmp_to_key(compareFun))
        return kb.copy(defs=tuple(sortedDefs)), Bool(False)

    def english(self):
        return self.definendum.english() + ", means: " + self.definition.english()

@dataclass(frozen=True)
class Potential(Ast):
    event:Idea
    precondition:Ast=Bool(True)
    durationSeconds:float=0.1
    # cmd:bool=True # for stuff like: "the enemy can hit the player?"

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        return kb.copy(pots=(*kb.pots, self)), Bool(False)

@dataclass(frozen=True)
class Order(Ast):
    agent:NounPhrase
    goal:Ast

@dataclass(frozen=True)
class Repeat(Ast):
    statement:Ast
    times:int

    def english(self): 
        return self.statement.english()+' '+str(self.times)+' times'

@dataclass(frozen=True)
class ExistentialQuantifier(Ast):
    thing:NounPhrase
    cmd:bool=True

    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        if self.cmd:
            return self.thing.tell().eval(kb)
        else:
            result=self.thing.ask().eval(kb)
            if isinstance(result, Zorror): return result
            return kb.updateStm(self.thing), Bool(bool(result[1]))

class Prog(Ast, Tuple[Ast, ...]):
    def eval(self, kb: 'KB') -> 'Tuple[KB, Constant]|Zorror':
        newKb=kb
        result=Bool(False)

        for x in self:
            tmp=x.eval(newKb)
            if isinstance(tmp, Zorror): return tmp
            newKb=tmp[0]
            result=tmp[1]
        return newKb, result