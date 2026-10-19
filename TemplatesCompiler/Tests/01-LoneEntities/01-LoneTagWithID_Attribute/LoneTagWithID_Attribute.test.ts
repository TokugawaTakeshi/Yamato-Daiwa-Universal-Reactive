import Testing from "node:test";
import Assert from "assert";
import generateViewObjectFormattedCode from "../../_Utils/generateViewObjectFormattedCode";
import getExpectedFormatedViewObjectCodeFromFile from "../../_Utils/getExpectedFormatedViewObjectCodeFromFile";
import { Logger } from "@yamato-daiwa/es-extensions";


Testing.

    test(
      "Lone Tag With ID Attribute",
      (): void => {
         Assert.strictEqual(
           generateViewObjectFormattedCode("01-LoneEntities/01-LoneTagWithID_Attribute/LoneTagWithID_Attribute.test.pug"),
           getExpectedFormatedViewObjectCodeFromFile(
             "01-LoneEntities/01-LoneTagWithID_Attribute/LoneTagWithID_Attribute.test.expected.js"
           )
         );
      }
    ).

    catch(Logger.logPromiseError);
