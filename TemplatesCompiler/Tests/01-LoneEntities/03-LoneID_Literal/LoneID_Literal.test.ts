import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Lone IT Literal",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("01-LoneEntities/03-LoneID_Literal/LoneID_Literal.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile(
             "01-LoneEntities/03-LoneID_Literal/LoneID_Literal.test.expected.js"
           )
         );
      }
    ).

    catch(Logger.logPromiseError);
