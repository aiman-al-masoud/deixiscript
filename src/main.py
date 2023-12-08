from dataclasses import field
from threading import Thread
from typing import List
from kb import KB
from lang import *
from parser import Parser
from plan import plan
from zorror import Zorror
from show import graphvizied, show
from os import environ
environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
# import pygame
from time import sleep

from matplotlib import pyplot as plt


@dataclass
class CLI:
    # surface:pygame.Surface
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
            case ':show-model': show(self.history[-1])
            case _: self.runCode(cmd)
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
        if maybe[1]:
            print(maybe[1].english())

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

    def redraw(self):
        plt.clf()
        plt.axis([0, 500, 0, 500])

        for thing in self.history[-1].wm:
            if 'x-coord' not in thing: continue
            x,y=thing['x-coord'],thing['y-coord']
            color=thing.get('color', 'black')
            colorCode=colorCodeOf(str(color))

            assert isinstance(x, Num) and isinstance(y, Num)
            plt.scatter([int(x)], [int(y)], s=[500], c=[colorCode])
        plt.savefig('world_tmp')
    
    def simulate(self):

        # pygame.event.get()

        # self.surface.fill((255,255,255))
        # for thing in self.history[-1].wm:
        #     x,y=thing['x-coord'],thing['y-coord']
        #     color=thing.get('color', 'black')
        #     colorCode=colorCodeOf(str(color))
        #     assert isinstance(x, Num) and isinstance(y, Num)
        #     drawCircle(self.surface, colorCode, (int(x), int(y)), 20)
        # pygame.display.flip()

        # plt.xlim([0,1000])
        # plt.ylim([0,1000])

        if not self.isSimulating: return

        for order in self.history[-1].ords:
            maybePlan=plan(order, self.history[-1], self.LOOP_FREQ_SECONDS)
            if isinstance(maybePlan, Zorror): raise Exception(maybePlan)
            steps=maybePlan[0]
            maybeResult=Prog(steps).eval(self.history[-1])
            if isinstance(maybeResult, Zorror): raise Exception(maybeResult)
            kb=maybeResult[0]
            self.history.append(kb)

        # pygame.time.delay(int(self.LOOP_FREQ_SECONDS*1000))

def colorCodeOf(name:str, alpha=0.5)->Tuple[int,int,int,int]:
    return {
        'black': (0,0,0,alpha),
        'red': (1,0,0, alpha),
        'green': (0,1,0, alpha),
        'blue': (0,0,1, alpha),
    }[name]

# def drawCircle(surface:pygame.Surface, color:Tuple[int,int,int,int], center:Tuple[int, int], radius:float):
#     target_rect = pygame.Rect(center, (0, 0)).inflate((radius * 2, radius * 2))
#     shape_surf = pygame.Surface(target_rect.size, pygame.SRCALPHA)
#     pygame.draw.circle(shape_surf, color, (radius, radius), radius)
#     surface.blit(shape_surf, target_rect)


if __name__ == '__main__':
    # pygame.init()
    # screen=pygame.display.set_mode([500, 500])
    # cli=CLI(screen)
    cli=CLI()
    # cli.load('./examples/player-enemy-2d.txt')

    def cliLoop():
        while True: cli.runCmd(input('> '))

    Thread(target=cliLoop, daemon=True).start()

    while True: 
        cli.simulate()
        cli.redraw()
        sleep(cli.LOOP_FREQ_SECONDS)


# https://graphviz.org/docs/attrs/pos/
# https://graphviz.org/Gallery/neato/transparency.html