from dataclasses import field
from threading import Thread
from typing import List
from kb import KB
from lang import *
from parser import Parser
from plan import plan
from zorror import Zorror
from show import graphvizied
from os import environ
environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
import pygame

@dataclass
class CLI:
    surface:pygame.Surface
    LOOP_FREQ_SECONDS=0.4
    isSimulating:bool=False
    history:List[KB]=field(default_factory=lambda:[KB()]) 
    parser:Parser=field(default_factory=lambda:Parser('./grammar.lark'))

    def runCmd(self, cmd:str):
        match cmd.split(' ')[0]:
            case ':load': self.load(cmd.split(' ')[1])
            case ':undo': self.undo()
            case ':start-simulation': self.startSimulation()
            case ':pause-simulation': self.pauseSimulation()
            case _: self.runCode(cmd)
            # case ':show-model': pass
            # case ':show-potentials': pass
            # case ':show-definitions': pass

    def startSimulation(self): self.isSimulating=True
    def pauseSimulation(self): self.isSimulating=False

    def runCode(self, code:str):
        try: ast=self.parser.parse(code)
        except Exception as e:
            i=str(e).index('Expected one of')
            print('Syntax error', str(e)[:i])
            return
        maybe=ast.eval(self.history[-1])
        if isinstance(maybe, Zorror):
            print(maybe.msg)
            return
        if maybe[0]!=self.history[-1]:
            self.history.append(maybe[0])
        
    def load(self, filename:str):
        try: code=open(filename).read()
        except Exception as e:
            print(e)
            return
        self.runCode(code)
    
    def undo(self):
        if len(self.history)==1:
            print('Nothing to undo')
            return
        self.history.pop()
    
    def simulate(self):

        pygame.event.get()

        self.surface.fill((255,255,255))
        for thing in self.history[-1].wm:
            x,y=thing['x-coord'],thing['y-coord']
            color=thing.get('color', 'black')
            colorCode=colorCodeOf(str(color))
            assert isinstance(x, Num) and isinstance(y, Num)
            drawCircle(self.surface, colorCode, (int(x), int(y)), 20)
        pygame.display.flip()

        if not self.isSimulating: return

        # maybe just use graphviz?

        for order in self.history[-1].ords:
            maybePlan=plan(order, self.history[-1], self.LOOP_FREQ_SECONDS)
            if isinstance(maybePlan, Zorror): raise Exception(maybePlan)
            steps=maybePlan[0]
            maybeResult=Prog(steps).eval(self.history[-1])
            if isinstance(maybeResult, Zorror): raise Exception(maybeResult)
            kb=maybeResult[0]
            self.history.append(kb)
        pygame.time.delay(int(self.LOOP_FREQ_SECONDS*1000))

def colorCodeOf(name:str, alpha=50)->Tuple[int,int,int,int]:
    return {
        'black': (0,0,0,alpha),
        'red': (255,0,0, alpha),
        'green': (0,255,0, alpha),
        'blue': (0,0,255, alpha),
    }[name]

def drawCircle(surface:pygame.Surface, color:Tuple[int,int,int,int], center:Tuple[int, int], radius:float):
    target_rect = pygame.Rect(center, (0, 0)).inflate((radius * 2, radius * 2))
    shape_surf = pygame.Surface(target_rect.size, pygame.SRCALPHA)
    pygame.draw.circle(shape_surf, color, (radius, radius), radius)
    surface.blit(shape_surf, target_rect)


if __name__ == '__main__':
    pygame.init()
    screen=pygame.display.set_mode([500, 500])
    cli=CLI(screen)
    cli.load('./examples/player-enemy-2d.txt')

    def cliLoop():
        while True: cli.runCmd(input('> '))

    Thread(target=cliLoop, daemon=True).start()

    while True: 
        cli.simulate()

# https://graphviz.org/docs/attrs/pos/
# https://graphviz.org/Gallery/neato/transparency.html