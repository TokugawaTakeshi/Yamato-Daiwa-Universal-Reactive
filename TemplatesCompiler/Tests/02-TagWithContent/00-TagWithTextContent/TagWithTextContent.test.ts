import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Text Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("02-TagWithContent/00-TagWithTextContent/TagWithTextContent.test.pug"),
       getExpectedFormatedViewObjectCodeFromFile("02-TagWithContent/00-TagWithTextContent/TagWithTextContent.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
