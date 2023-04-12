import { Thing } from "../backend/Thing";
import { AstNode } from "../frontend/parser/interfaces/AstNode";

export interface BrainListener {
    onUpdate(ast: AstNode, results: Thing[]): void
}