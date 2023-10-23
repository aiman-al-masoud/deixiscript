from core.Explicit import Explicit


class Str(str, Explicit):
    
    @classmethod
    @property
    def GAP(cls):
        '''linguistic gap denoting the empty noun-phrase'''
        return Str('_')
