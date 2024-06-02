import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Nested Tags",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("01-Regular/00-NestedTags/NestedTags.test.pug"),
       getExpectedFormatedVieObjectCodeFromFile("01-Regular/00-NestedTags/NestedTags.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
