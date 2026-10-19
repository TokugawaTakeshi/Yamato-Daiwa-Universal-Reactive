import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Text Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode(
         "04-MultipleTags/00-MultipleTagsAtTopLevel/MultipleTagsAtTopLevel.test.pug"
       ),
       getExpectedFormatedViewObjectCodeFromFile(
         "04-MultipleTags/00-MultipleTagsAtTopLevel/MultipleTagsAtTopLevel.test.expected.js"
       )
     );
  }
).catch(Logger.logPromiseError);
