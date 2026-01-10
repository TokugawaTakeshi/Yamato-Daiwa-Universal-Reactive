import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Tag with Text Content",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("00-Simple/02-TagWithTextContent/TagWithTextContent.test.pug"),
       getExpectedFormatedVieObjectCodeFromFile("00-Simple/02-TagWithTextContent/TagWithTextContent.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
