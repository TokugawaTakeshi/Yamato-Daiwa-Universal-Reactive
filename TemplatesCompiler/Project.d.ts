declare module "pug-parser" {
  import type PugLexer from "pug-lexer";
  export default function (tokens: ReadonlyArray<PugLexer.Token>): object;
}
