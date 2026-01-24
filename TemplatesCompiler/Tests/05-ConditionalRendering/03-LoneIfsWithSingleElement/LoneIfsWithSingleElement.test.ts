import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Lone If",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "05-ConditionalRendering/03-LoneIfsWithSingleElement/LoneIfWithSingleElement.test.pug"
       ),
       getExpectedFormatedViewObjectCodeFromFile(
         "05-ConditionalRendering/03-LoneIfsWithSingleElement/LoneIfWithSingleElement.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
