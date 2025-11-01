import type PugAST from "./PugAST/PugAST";
import isTagPugNode from "./PugAST/isTagPugNode";
import isCodePugNode from "./PugAST/isCodePugNode";
import isTextPugNode from "./PugAST/isTextPugNode";
import isConditionalPugNode from "./PugAST/isConditionalPugNode";

import {
  AlgorithmMismatchError,
  isNotUndefined,
  isUndefined,
  Logger,
  removeSpecificCharacterFromCertainPosition
} from "@yamato-daiwa/es-extensions";


type PugBlockProcessingResult = Readonly<{
  outputCodeStatements: ReadonlyArray<string>;
  directChildrenElementsVariablesNames: ReadonlyArray<string>;
}>;

type TagNodeProcessingResult = Readonly<{
  outputCodeStatements: ReadonlyArray<string>;
  assignedElementVariableName: string;
}>;


export class TemplatesCompiler {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static readonly eventsAttributesAndNativeJavaScriptEventsNamesCorrespondence: ReadonlyMap<string, string> = new Map([

    /* ┅┅┅ Mouse Events ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    [ "onLeftClick", "click" ],
    [ "onDoubleLeftClick", "dblclick" ],
    [ "onRightClick", "auxclick" ],
    [ "onMouseDown", "mousedown " ],
    [ "onMouseUp", "mouseup" ],
    [ "onMouseMoved", "mousemove" ],
    [ "onMouseOver", "mouseover" ],
    [ "onMouseOut", "mouseout" ],
    [ "onMouseEntered", "mouseenter" ],
    [ "onMouseLeft", "mouseleave" ],

    /* ┅┅┅ Keyboard Events ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    [ "onKeyPressed", "keypress" ],
    [ "onKeyUp", "keyup" ],
    [ "onKeyDown", "keydown" ],
    [ "onInput", "input" ],

    /* ┅┅┅ Common ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    [ "onChange", "change" ]

  ]);


  /* ━━━ Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private readonly elementsCounters: Array<number> = [];
  private readonly reactiveStateFieldsKeys: Set<string> = new Set();
  private currentDepth__numerationFrom0: number = -1;
  private readonly namesOfElementsOfTopLevel: Set<string> = new Set();


  public static generateCode(rawView: PugAST.Block): string {

    const selfInstance: TemplatesCompiler = new TemplatesCompiler();

    return "{" +

      "generateInitialDOM({ $reactiveState, $constantState, $eventsHandlers }) {" +
        selfInstance.processPugBlock(rawView).outputCodeStatements.join("") +
        `return [${ Array.from(selfInstance.namesOfElementsOfTopLevel).join(",") }];` +
      "}," +

      "onStateFieldsChangedHandlers: new Map([" +
        Array.from(selfInstance.reactiveStateFieldsKeys).
            map((stateFieldKey: string): string => `[ "${ stateFieldKey }", new Set() ],`).
            join(",") +
      "])," +

      "methodsReferences: new Map()" +

    "}";

  }


  private processPugBlock(
    targetPugBLock: PugAST.Block,
    parentElementVariableName?: string
  ): PugBlockProcessingResult {

    const statementsForCurrentBlock: Array<string> = [];
    const directChildrenElementsVariablesNames: Array<string> = [];

    this.incrementDOM_DepthLevel();

    for (const pugNode of targetPugBLock.nodes) {

      if (isTagPugNode(pugNode)) {

        const tagNodeAnalyzingResult: TagNodeProcessingResult = this.processTagNode(pugNode);

        directChildrenElementsVariablesNames.push(tagNodeAnalyzingResult.assignedElementVariableName);
        statementsForCurrentBlock.push(...tagNodeAnalyzingResult.outputCodeStatements);

        continue;

      }


      if (isCodePugNode(pugNode)) {

        if (isUndefined(parentElementVariableName)) {
          Logger.throwErrorWithFormattedMessage({
            errorInstance: new AlgorithmMismatchError(
              "Expected `parentElementVariableName` be initialized for text blocks."
            ),
            title: AlgorithmMismatchError.localization.defaultTitle,
            occurrenceLocation: "templatesCompiler.processPugBlock(targetPugBLock, parentElementVariableName)"
          });
        }


        if (pugNode.val.startsWith("$reactiveState.")) {
          this.reactiveStateFieldsKeys.add(pugNode.val.replace("$reactiveState.", ""));
        }

        statementsForCurrentBlock.push(
          `${ parentElementVariableName }.textContent = String(${ pugNode.val });`,
          TemplatesCompiler.generateCodeBlockForCodeNode(pugNode, parentElementVariableName)
        );

        continue;

      }


      if (isTextPugNode(pugNode)) {

        statementsForCurrentBlock.push(
          `${ parentElementVariableName }.textContent = "${ pugNode.val }";`
        );

        continue;

      }


      if (isConditionalPugNode(pugNode)) {
        statementsForCurrentBlock.push(
          `if (stateFields.${ pugNode.test }) {}`
        );
      }

    }

    this.decrementDOM_DepthLevel();

    return {
      outputCodeStatements: statementsForCurrentBlock,
      directChildrenElementsVariablesNames
    };

  }

  private processTagNode(tagNode: PugAST.Tag): TagNodeProcessingResult {

    this.elementsCounters[this.currentDepth__numerationFrom0]++;

    const elementVariableName: string = `element${ this.currentElementPostfix }`;

    if (this.currentDepth__numerationFrom0 === 0) {
      this.namesOfElementsOfTopLevel.add(elementVariableName);
    }

    const statementsForTagNode: Array<string> = [
      TemplatesCompiler.generateElementVariableInitializingDeclaration({ elementVariableName, tagName: tagNode.name })
    ];

    for (const attribute of tagNode.attrs) {

      if (attribute.name.startsWith("@")) {

        const eventName: string = removeSpecificCharacterFromCertainPosition({
          targetCharacter: "@",
          fromFirstPosition: true,
          targetString: attribute.name
        });

        const targetNativeEvent: string | undefined = TemplatesCompiler.
            eventsAttributesAndNativeJavaScriptEventsNamesCorrespondence.get(eventName);

        if (isUndefined(targetNativeEvent)) {
          Logger.throwErrorWithFormattedMessage({
            errorType: "UnknownYDUR_Event",
            title: "Unknown YDUR Event",
            description: `Event "${ targetNativeEvent }" is unknown.`,
            occurrenceLocation: "TemplatesCompiler.processPugBlock(targetPugBLock, parentElementVariableName)"
          });
        }


        statementsForTagNode.push(
          TemplatesCompiler.generateMethodReferenceRegistrationDeclaration({
            elementVariableName,
            nativeEventName: targetNativeEvent,
            handlerName: attribute.val
          })
        );

        continue;

      }


      statementsForTagNode.push(
        `${ elementVariableName }.setAttribute("${ attribute.name }", ${ attribute.val.replaceAll("'", "\"") });`
      );

    }

    if (isNotUndefined(tagNode.block)) {

      const pugBlockProcessingResult: PugBlockProcessingResult = this.processPugBlock(tagNode.block, elementVariableName);

      statementsForTagNode.push(...pugBlockProcessingResult.outputCodeStatements);

      if (pugBlockProcessingResult.directChildrenElementsVariablesNames.length > 0) {
        statementsForTagNode.push(
          `${ elementVariableName }.append(${ pugBlockProcessingResult.directChildrenElementsVariablesNames.join(",") });`
        );
      }

    }

    return {
      outputCodeStatements: statementsForTagNode,
      assignedElementVariableName: elementVariableName
    };

  }

  private incrementDOM_DepthLevel(): void {
    this.currentDepth__numerationFrom0++;
    this.elementsCounters.push(-1);
  }

  private decrementDOM_DepthLevel(): void {
    this.currentDepth__numerationFrom0--;
    this.elementsCounters.pop();
  }

  private get currentElementPostfix(): string {
    return this.elementsCounters.reduce(
      (workpiece: string, counter: number): string => `${ workpiece }_${ counter }`,
      ""
    );
  }


  private static generateCodeBlockForCodeNode(codeNode: PugAST.Code, parentElementVariableName: string): string {

    if (codeNode.val.startsWith("$reactiveState")) {
      return `this.onStateFieldsChangedHandlers.get("${ codeNode.val.replace("$reactiveState.", "") }").` +
        `add(value => { ${ parentElementVariableName }.textContent = String(value); });`;
    }


    return "";

  }

  private static generateElementVariableInitializingDeclaration(
    {
      elementVariableName,
      tagName
    }: Readonly<{
      elementVariableName: string;
      tagName: string;
    }>
  ): string {
    return `const ${ elementVariableName } = document.createElement("${ tagName }");`;
  }

  private static generateMethodReferenceRegistrationDeclaration(
    {
      elementVariableName,
      nativeEventName,
      handlerName
    }: Readonly<{
      elementVariableName: string;
      nativeEventName: string;
      handlerName: string;
    }>
  ): string {
    return `(() => {
      
      const { handler, options } = $eventsHandlers.get("${ handlerName }");
      
      ${ elementVariableName }.addEventListener(
        "${ nativeEventName }",
        event => {
        
          if (options.mustKeepDefaultBehaviour !== true) {
            event.stopPropagation();
          }
          
          handler(event);  
        
        },
        { capture: options.eventPropagation === "CAPTURING", once: options.mustBeCalledOnce }
      );
      
    })();`;
  }

}
