# from functools import reduce
# import re

# def tokenize(source:str):

#     punctuation = ['(', ')', '=', '?', '!']
#     escaped = [re.escape(s) for s in punctuation]
#     capture = reduce(lambda a,b: f"{a}|{b}", escaped)

#     x1 = re.findall('"(.*?)"', source)
#     x2 = ['"'+s+'"' for s in x1]
#     x3 = reduce(lambda a,b: a.replace(b[1], '$'+str(b[0])), enumerate(x2), source)
#     x4 = re.split('('+capture+')|\\s+', x3)
#     x5 = [s for s in x4 if s]
#     x6 = [s.lower() for s in x5]
#     x7 = [x1[int(s[1])] if s[0]=='$' else s for s in x6]
#     x8 = [float(s) if s.isnumeric() else s for s in x7]
#     return x8