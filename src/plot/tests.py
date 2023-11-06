
from core.EB import the
from plot.show import save_png, show

def tezt_c41():
    kb0 = the('horse').tell()
    kb1 = the('man').tell(kb0)
    kb2 = the('man').does('ride').on(the('horse')).tell(kb1)
    kb3 = the('horse').does('move').tell(kb2)
    kb4 = the('man').does('yell').tell(kb3)
    show(kb4)
    # save_png(kb4.wm)
 
# tezt_c41()