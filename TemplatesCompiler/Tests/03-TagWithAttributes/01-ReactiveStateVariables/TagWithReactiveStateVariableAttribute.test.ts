import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Reactive State Variable Attribute",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "03-TagWithAttributes/01-ReactiveStateVariables/TagWithReactiveStateVariableAttribute.test.pug"
       ),
       getExpectedFormatedViewObjectCodeFromFile(
         "03-TagWithAttributes/01-ReactiveStateVariables/TagWithReactiveStateVariableAttribute.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
