import { getParser } from '../parser/parser.ts';
import { ast_node } from './deixi-ast.ts';
import { syntaxes } from './grammar.ts';

export const parse = (sourceCode: string) => getParser(sourceCode, syntaxes).parse() as ast_node

