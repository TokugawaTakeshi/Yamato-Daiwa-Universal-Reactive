import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Lone Tag With ID Literal",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("01-LoneEntities/02-LoneTagWithID_Literal/LoneTagWithID_Literal.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile(
             "01-LoneEntities/02-LoneTagWithID_Literal/LoneTagWithID_Literal.test.expected.js"
           )
         );
      }
    ).

    catch(Logger.logPromiseError);
