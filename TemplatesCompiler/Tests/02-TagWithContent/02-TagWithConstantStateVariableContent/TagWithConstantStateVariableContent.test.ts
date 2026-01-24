import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Constant State Variable Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "02-TagWithContent/02-TagWithConstantStateVariableContent/TagWithConstantStateVariableContent.test.pug"
       ),
       getExpectedFormatedViewObjectCodeFromFile(
         "02-TagWithContent/02-TagWithConstantStateVariableContent/TagWithConstantStateVariableContent.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
