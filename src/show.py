# from dataclasses import dataclass
# from threading import Thread
# import tkinter as tk

# from lark import Lark
# from kb import KB
# from toast import Toast
# # @dataclass
# # class GUI:
# #     kb:KB
# #     canvas:tk.Canvas
# #     thread:Thread=Thread(target=self.update)

# #     def setKB(self, kb:KB):
# #         pass

# #     def update(self):
# #         for k,v in self.kb.world.items():
# #             if 'x-coord' in v:
# #                 pass


# def updateScreen(kb:KB, canvas:tk.Canvas):

#     canvas.delete('all')
#     sprites=[v for v in kb.world.values() if 'x-coord' in v]

#     for s in sprites:
#         x=s['x-coord']
#         y=s['y-coord']
#         color=s['color']
#         canvas.create_oval(x, y, x+30, y+30, fill=color) #pyright:ignore


# master=tk.Tk()
# master.title('Deixi')
# canvas=tk.Canvas(
#     master,
#     width=300,
#     height=200,
# )

# # updateScreen(kb, canvas)

# canvas.pack(expand=True, fill='both')
# # canvas.create_oval(2, 3, 30, 20, fill='green')
# tk.mainloop()


# # def handle_motion(e:tk.Event):
# #     canvas.create_oval(e.x, e.y, e.x+1, e.y+1, fill='green')
# # # canvas.delete('all')
# # canvas.bind('<B1-Motion>', handle_motion)
# # tk.mainloop()






# rm tmp.gv.png
# touch tmp.gv.png 
# codium tmp.gv.png
# clear
# rlwrap python -m main.main


# from core.KB import KB
# def show(kb:KB):
#     from graphviz import Source
#     source = graphvizied(kb)
#     Source(source, filename='tmp.png').view()

# def save_png(kb:KB):
#     from graphviz import Source
#     source = graphvizied(kb)
#     Source(source, filename='tmp.gv', format='png').render()

# def graphvizied(kb:KB):
#     from functools import reduce
#     x0=[f'"{x}" [fillcolor=red,style=filled];' for x in kb.it.unroll()]
#     x1=[f'"{s[0]}" -> "{s[1]}" [ label="{s[2]}" ];' for s in kb.wm]
#     x2=reduce(lambda a,b:a+b+'\n', [*x0, *x1], '')
#     x3=f'digraph G{{\n{x2}}}'
#     return x3

# # def ast_to_graphviz(ast:Ast):
# #     raise Exception

# from core.EB import the
# from plot.show import save_png, show

# def tezt_c41():
#     kb0 = the('horse').tell()
#     kb1 = the('man').tell(kb0)
#     kb2 = the('man').does('ride').on(the('horse')).tell(kb1)
#     kb3 = the('horse').does('move').tell(kb2)
#     kb4 = the('man').does('yell').tell(kb3)
#     show(kb4)
#     # save_png(kb4.wm)
 
# # tezt_c41()