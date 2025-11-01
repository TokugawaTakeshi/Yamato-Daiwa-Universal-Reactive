const PugLexer = require("pug-lexer");
const generatePugAST = require("pug-parser");
const { TemplatesCompiler: YamatoDaiwaUniversalReactiveTemplatesCompiler } =
    require("@yamato-daiwa/universal-reactive-templates-compiler");
const formatJavaScript = require("js-beautify").js;
const { validate } = require("schema-utils");


const schema = {
  type: "object",
  properties: {
    debug: {
      type: "boolean"
    }
  }
};

module.exports = function(sourceCode) {

  const options = this.getOptions();
  const callback = this.async();

  try {

    const tokens = PugLexer(sourceCode);

    const PugAST = generatePugAST(tokens, { src: sourceCode });

    if (options.debug) {
      console.log(
        "@yamato-daiwa/universal-reactive-webpack-loader, formatted output:\n" +
        formatJavaScript(
          `export default ${ YamatoDaiwaUniversalReactiveTemplatesCompiler.generateCode(PugAST) };`,
          {
            indent_size: 2,
            end_with_newline: true,
            eol: "\n",
            brace_style: "collapse"
          }
        )
      );
    }

    callback(
      null,
      `export default ${ YamatoDaiwaUniversalReactiveTemplatesCompiler.generateCode(PugAST) };`
    );

  } catch (error) {

    callback(error);

    return null;

  }

};
