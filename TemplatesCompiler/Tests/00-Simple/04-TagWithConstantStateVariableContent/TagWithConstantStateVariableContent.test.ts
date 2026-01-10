import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Constant State Variable Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "00-Simple/04-TagWithConstantStateVariableContent/TagWithConstantStateVariableContent.test.pug"
       ),
       getExpectedFormatedVieObjectCodeFromFile(
         "00-Simple/04-TagWithConstantStateVariableContent/TagWithConstantStateVariableContent.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
