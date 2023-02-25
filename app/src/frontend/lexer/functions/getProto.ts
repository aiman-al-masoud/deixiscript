import { Lexeme } from "../Lexeme";

export function getProto(lexeme: Lexeme): Object | undefined {
    return (window as any)?.[lexeme.proto as any]?.prototype;
}
