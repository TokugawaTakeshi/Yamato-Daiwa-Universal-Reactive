import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Reactive State Variable Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "00-Simple/03-TagWithReactiveStateVariableContent/TagWithReactiveStateVariableContent.test.pug"
       ),
       getExpectedFormatedVieObjectCodeFromFile(
         "00-Simple/03-TagWithReactiveStateVariableContent/TagWithReactiveStateVariableContent.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
