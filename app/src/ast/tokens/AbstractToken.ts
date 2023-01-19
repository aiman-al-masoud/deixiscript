import { Lexeme } from "../../lexer/Lexeme";
import Token from "../interfaces/Token";

export default abstract class AbstractToken implements Token {

    constructor(readonly lexeme: Lexeme, readonly string = lexeme.token ?? '') {

    }
}