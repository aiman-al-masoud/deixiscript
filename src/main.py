from typing import List
from kb import KB
from lang import *
from parser import Parser
from plan import plan
from zorror import Zorror

# class CLI:
#     history:List[KB]=[KB()]
#     parser=Parser('./grammar.lark')

def main():
    history:List[KB]=[KB()]
    parser=Parser('./grammar.lark')

    while True:
        cmd=input('> ').strip()
        if not cmd: continue
        
        match cmd.split(' ')[0]:
            case ':load':
                if len(cmd.split(' '))!=2:
                    print('please specify a file name')
                    continue

                filename=cmd.split(' ')[1]

                try: code=open(filename).read()
                except Exception as e:
                    print(e)
                    continue
                
                try: program=parser.parse(code)
                except Exception as e:
                    i=str(e).index('Expected one of')
                    print('Syntax error', str(e)[:i])
                    continue

                maybe=program.eval(history[-1])
                if isinstance(maybe, Zorror): 
                    print(maybe.msg)
                    continue

                history.append(maybe[0])
            case ':undo':
                if len(history)==1:
                    print('Nothing to undo')
                    continue
                history.pop()
            case ':quit':
                exit()
            case ':show-world-model':
                raise Exception
            case ':show-potentials':
                raise Exception
            case ':show-definitions':
                raise Exception
            case ':run-simulation':
                raise Exception
            case _:
                
                try: program=parser.parse(cmd)
                except Exception as e:
                    i=str(e).index('Expected one of')
                    print('Syntax error', str(e)[:i])
                    continue

                maybe=program.eval(history[-1])
                if isinstance(maybe, Zorror): 
                    print(maybe.msg)
                    continue

                if maybe[0]!=history[-1]:
                    history.append(maybe[0])
                
                # if maybe[1]: print('yes')

# if __name__ == '__main__':
#     main()
# ------------------------------------------

import pygame
from show import graphvizied

def draw_circle_alpha(surface:pygame.Surface, color:Tuple[int,int,int,int], center, radius):
    target_rect = pygame.Rect(center, (0, 0)).inflate((radius * 2, radius * 2))
    shape_surf = pygame.Surface(target_rect.size, pygame.SRCALPHA)
    pygame.draw.circle(shape_surf, color, (radius, radius), radius)
    surface.blit(shape_surf, target_rect)

maybeKB=Parser().parse(open('./examples/player-enemy-2d.txt').read()).eval(KB())
if isinstance(maybeKB, Zorror):
    print(maybeKB)
    exit()

kb=maybeKB[0]
pygame.init()

def getColor(name:str)->Tuple[int,int,int]:
    return {
        'black': (0,0,0),
        'red': (255,0,0),
        'green': (0,255,0),
        'blue': (0,0,255),
    }[name]

screen=pygame.display.set_mode([500, 500])
running=True
LOOP_FREQ_SECONDS=0.4

while running:

    print(graphvizied(kb))
    screen.fill((255,255,255))

    # update sprites (dots)
    for thing in kb.wm:
        # print(thing)
        color=thing.get('color', Str('black'))
        x=thing.get('x-coord')
        y=thing.get('y-coord')
        assert isinstance(color, Str) and isinstance(x, Num) and isinstance(y,Num)
        draw_circle_alpha(screen, (*getColor(color), 70), (int(x), int(y)), 20)
    
    pygame.display.flip()

    # plan and update KB
    for order in kb.ords:
        maybePlan=plan(order, kb, LOOP_FREQ_SECONDS)
        if isinstance(maybePlan, Zorror): raise Exception(maybePlan)
        steps=maybePlan[0]
        maybeResult=Prog(steps).eval(kb)
        if isinstance(maybeResult, Zorror): raise Exception(maybeResult)
        kb=maybeResult[0]

    pygame.time.delay(int(LOOP_FREQ_SECONDS*1000))

