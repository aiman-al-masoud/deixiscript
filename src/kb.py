from dataclasses import dataclass
from types import MappingProxyType as MPT
from typing import TYPE_CHECKING, Tuple
if TYPE_CHECKING: from lang import *
from zorror import Zorror


@dataclass(frozen=True)
class KB:
    wm:Tuple[MPT[str, 'Constant'], ...]=tuple()
    stm:Tuple['NounPhrase', ...]=tuple()
    defs:Tuple['Def', ...]=tuple()
    pots:Tuple['Potential', ...]=tuple()
    ords:Tuple['Order', ...]=tuple()
    STM_SIZE:int=4

    def copy(self, **kwargs): 
        return KB(**{**self.__dict__, **kwargs})

    def updateStm(self, noun:'NounPhrase'):
        from match import match

        if any([match(noun, sub) for sub in self.stm]):
            return self

        return self.copy(stm=(noun, *self.stm)[:self.STM_SIZE])

    def getProp(self, id:'Id', prop:str):
        thing=self.wm[id]
        if prop not in thing: return Zorror('')
        return thing[prop]

    def setProp(self, id:'Id', prop:str, value:'Constant'):
        thing=self.wm[id]
        newThing=MPT({**thing, prop: value})
        newWm=self.wm[:id] + (newThing,) +  self.wm[id+1:]
        return self.copy(wm=newWm)

    def create(self, mytype:str)->'Tuple[KB, Id]':
        from lang import Id, Str
        newThing=MPT({'type' : Str(mytype)})
        newWm=(*self.wm, newThing)
        return self.copy(wm=newWm), Id(len(newWm)-1)

    def disambiguate(self, ast:'NounPhrase'):
        from match import match
        return next((noun for noun in self.stm if match(ast, noun)), None)
