/**
 * Programmatic Semantics: a mapping between natural 
 * linguistic structures and basic programming language structures.
 * 
 * You need a general data format to configure the mapping between
 * Deixiscript (natlang-like) AST types and Intermediate (JS-like) AST types.
 * 
 * A single Deixiscript AST can translate to one or more Intermediate ASTs
 * of different types, based on component types.
 * 
 */

import { ast_node } from "./ast-types.ts";
import { IAst } from "./intermediate-ast.ts";

type x = ast_node['type']
type y = IAst['type']

