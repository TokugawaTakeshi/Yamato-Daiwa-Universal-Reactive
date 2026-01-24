import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import Testing from "node:test";
import Assert from "assert";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Lone Comment",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("01-LoneEntities/05-LoneComment/LoneComment.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile("01-LoneEntities/05-LoneComment/LoneComment.test.expected.js")
         );
      }
    ).

    catch(Logger.logPromiseError);
