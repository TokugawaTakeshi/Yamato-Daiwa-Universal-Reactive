import type PugAST from "../../Source/PugAST/PugAST";
import { TemplatesCompiler } from "../../Source";

import PugLexer from "pug-lexer";
import generatePugAST from "pug-parser";

import Path from "path";
import FileSystem from "fs";
import CodeFormatter from "js-beautify";


export default function generateViewObjectFormattedCode(targetFilePath: string): string {

  const pugCode: string = FileSystem.readFileSync(
    Path.join(process.cwd(), "Tests", targetFilePath),
    "utf-8"
  );

  const tokens: ReadonlyArray<PugLexer.Token> = PugLexer(pugCode);

  /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
  * Usable to declare "pug-parser" modules as function returning the `PugAST.Block` because relative paths in imports
  *   are not allowed while `PugAST.Block` is in internal dependency. */
  const pugAST: PugAST.Block = generatePugAST(tokens) as PugAST.Block;

  const rawCode: string = TemplatesCompiler.generateCode(pugAST);

  /* [ Approach ] The "export default" requires for correct formatting. */
  return CodeFormatter.js(
    `export default ${ rawCode }`,
    {
      indent_size: 2,
      end_with_newline: true,
      eol: "\n",
      brace_style: "collapse"
    }
  );

}
