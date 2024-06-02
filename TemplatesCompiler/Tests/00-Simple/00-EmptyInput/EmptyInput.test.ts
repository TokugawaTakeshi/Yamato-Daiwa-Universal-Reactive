import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import Testing from "node:test";
import Assert from "assert";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Empty Input",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("00-Simple/00-EmptyInput/EmptyInput.test.pug"),
       getExpectedFormatedVieObjectCodeFromFile("00-Simple/00-EmptyInput/EmptyInput.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
