import generateViewObjectFormattedCode from "../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import Testing from "node:test";
import Assert from "assert";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Empty Input",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("00-EmptyInput/EmptyInput.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile("00-EmptyInput/EmptyInput.test.expected.js")
         );
      }
    ).

    catch(Logger.logPromiseError);
