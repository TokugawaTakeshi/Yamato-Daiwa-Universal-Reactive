import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedVieObjectCodeFromFile from "../../_Utils/getExpectedFormatedVieObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.test(
  "Lone Tag",
  (): void => {
     Assert.strictEqual(
       generateViewObjectFormattedCode("00-Simple/01-LoneTag/LoneTag.test.pug"),
       getExpectedFormatedVieObjectCodeFromFile("00-Simple/01-LoneTag/LoneTag.test.expected.js")
     );
  }
).catch(Logger.logPromiseError);
