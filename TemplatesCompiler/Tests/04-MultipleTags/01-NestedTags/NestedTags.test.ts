import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Nested Tags",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("04-MultipleTags/01-NestedTags/NestedTags.test.pug"),
       getExpectedFormatedViewObjectCodeFromFile("04-MultipleTags/01-NestedTags/NestedTags.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
