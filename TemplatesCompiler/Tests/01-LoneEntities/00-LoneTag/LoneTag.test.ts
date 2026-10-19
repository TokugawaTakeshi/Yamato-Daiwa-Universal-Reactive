import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Lone Tag",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("01-LoneEntities/00-LoneTag/LoneTag.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile("01-LoneEntities/00-LoneTag/LoneTag.test.expected.js")
         );
      }
    ).

    catch(Logger.logPromiseError);
