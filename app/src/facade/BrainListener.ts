import { Thing } from "../backend/things/Thing";
import { AstNode } from "../frontend/parser/interfaces/AstNode";

export interface BrainListener {
    onUpdate(ast: AstNode, results: Thing[]): void
}