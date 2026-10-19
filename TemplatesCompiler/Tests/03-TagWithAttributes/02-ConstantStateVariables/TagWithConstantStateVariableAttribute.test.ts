import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Constant State Variable Attribute",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "03-TagWithAttributes/02-ConstantStateVariables/TagWithConstantStateVariableAttribute.test.pug"
       ),
       getExpectedFormatedViewObjectCodeFromFile(
         "03-TagWithAttributes/02-ConstantStateVariables/TagWithConstantStateVariableAttribute.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
