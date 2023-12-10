from dataclasses import field
from threading import Thread
from typing import List
from kb import KB
from lang import *
from parser import Parser
from plan import plan
from zorror import Zorror
from show import show
from time import sleep
from matplotlib import pyplot as plt
from os import environ
environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'


@dataclass
class CLI:
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
        if not self.isSimulating: return

        for order in self.history[-1].ords:
            maybePlan=plan(order, self.history[-1], self.LOOP_FREQ_SECONDS)
            if isinstance(maybePlan, Zorror): raise Exception(maybePlan)
            steps=maybePlan[0]
            maybeResult=Prog(steps).eval(self.history[-1])
            if isinstance(maybeResult, Zorror): raise Exception(maybeResult)
            kb=maybeResult[0]
            self.history.append(kb)

def colorCodeOf(name:str, alpha=0.5)->Tuple[int,int,int,int]:
    return {
        'black': (0,0,0,alpha),
        'red': (1,0,0, alpha),
        'green': (0,1,0, alpha),
        'blue': (0,0,1, alpha),
    }[name]

if __name__ == '__main__':
    cli=CLI()

    def cliLoop():
        while True: cli.runCmd(input('> '))

    Thread(target=cliLoop, daemon=True).start()

    while True: 
        cli.simulate()
        cli.redraw()
        sleep(cli.LOOP_FREQ_SECONDS)
