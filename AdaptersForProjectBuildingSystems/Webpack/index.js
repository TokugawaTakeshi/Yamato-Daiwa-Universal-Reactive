const PugLexer = require("pug-lexer");
const generatePugAST = require("pug-parser");
const {
  TemplatesCompiler: YamatoDaiwaUniversalReactiveTemplatesCompiler
} = require("@yamato-daiwa/universal-reactive-templates-compiler");


module.exports = function(sourceCode) {

  const callback = this.async();

  try {

    const tokens = PugLexer(sourceCode);

    const PugAST = generatePugAST(tokens, { src: sourceCode });

    callback(
      null,
      `import { LeftClickEventListener } from "@yamato-daiwa/es-extensions-browserjs";` +
      `export default ${ YamatoDaiwaUniversalReactiveTemplatesCompiler.generateCode(PugAST) };`);

  } catch (error) {

    callback(error);

    return null;

  }

};
