from dataclasses import dataclass
from threading import Thread
import tkinter as tk

from lark import Lark
from kb import KB
from toast import Toast


# @dataclass
# class GUI:
#     kb:KB
#     canvas:tk.Canvas
#     thread:Thread=Thread(target=self.update)

#     def setKB(self, kb:KB):
#         pass

#     def update(self):
#         for k,v in self.kb.world.items():
#             if 'x-coord' in v:
#                 pass


def updateScreen(kb:KB, canvas:tk.Canvas):

    canvas.delete('all')
    sprites=[v for v in kb.world.values() if 'x-coord' in v]

    for s in sprites:
        x=s['x-coord']
        y=s['y-coord']
        color=s['color']
        canvas.create_oval(x, y, x+30, y+30, fill=color) #pyright:ignore


master=tk.Tk()
master.title('Deixi')
canvas=tk.Canvas(
    master,
    width=300,
    height=200,
)

# updateScreen(kb, canvas)

canvas.pack(expand=True, fill='both')
# canvas.create_oval(2, 3, 30, 20, fill='green')
tk.mainloop()


# def handle_motion(e:tk.Event):
#     canvas.create_oval(e.x, e.y, e.x+1, e.y+1, fill='green')
# # canvas.delete('all')
# canvas.bind('<B1-Motion>', handle_motion)
# tk.mainloop()
