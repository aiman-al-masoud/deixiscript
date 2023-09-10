# # def f ()->int:
# #     return 1

# # x = [1,2,3]
# # x = [2,2,3]
# from typing import List, TypeVar, Union


# x = [3,2,'ciao']
# # x = [5,2,'ciao']
# # x = {"u":[1,3,4]}

# match x:
#     case [1, *stuff]:
#         print('one is first',stuff)
#     case [2, *buruf]:
#         print('twooo buruf', buruf)
#     case [3|4, *y, 'ciao']:
#         print(y)
#     case {"u": i}:
#         print(i)
#     case _:
#         raise Exception('')

# T = TypeVar('T')

# def capra(x:List[T])->T:
#     return x[0]

# u = capra([1,2,3])


# # Union[]

# from dataclasses import dataclass

# @dataclass(frozen=True)
# class A:
#     stuff:int

# @dataclass(frozen=True)
# class B:
#     stuff:int
#     crap:int

# # x=  A(1)
# # x.stuff=3

# def f (x):
#     match x:
#         case 1:
#             return 'ciao!'
#         case A():
#             return 2
#         case B(1,x):
#             return x

# print(f(B(1, 100)))






