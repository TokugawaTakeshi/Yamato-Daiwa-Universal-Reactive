import type PugAST from "./PugAST/PugAST";
import isTagPugNode from "./PugAST/NodeTypesCheckers/isTagPugNode";
import isCodePugNode from "./PugAST/NodeTypesCheckers/isCodePugNode";
import isTextPugNode from "./PugAST/NodeTypesCheckers/isTextPugNode";
import isConditionalPugNode from "./PugAST/NodeTypesCheckers/isConditionalPugNode";
import isBlockEmptyOrHasCommentChildrenOnly from "./PugAST/isBlockEmptyOrHasCommentChildrenOnly";

import {
  AlgorithmMismatchError,
  cropArray,
  isNotUndefined,
  isUndefined,
  Logger,
  removeLastCharacter,
  removeNthCharacter,
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

type ConditionalRenderingDeclarationGeneratingResult = Readonly<{
  conditionalRendererCode: string;
  conditionalRendererFunctionName: string;
  elementsVariables: ReadonlyArray<string>;
}>;

export type NodesCountersForSpecificDepthLevel = {
  element: number;
  text: number;
  placeholder: number;
  conditionalRenderer: number;
};


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
  private readonly nodesCounters: Array<NodesCountersForSpecificDepthLevel> = [];
  private readonly reactiveStateFieldsKeys: Set<string> = new Set();
  private currentDepth__numerationFrom0: number = -1;
  private readonly topLevelElementsAndGenerators: Set<string> = new Set();


  /* ━━━ Public Method ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static generateCode(rawView: PugAST.Block): string {

    const selfInstance: TemplatesCompiler = new TemplatesCompiler();

    return "{" +

      "initializeDOM({ $reactiveState, $constantState, $eventsHandlers }) {" +
        selfInstance.processPugBlock({ targetPugBlock: rawView }).outputCodeStatements.join("") +
        `return [${ Array.from(selfInstance.topLevelElementsAndGenerators).join(",") }];` +
      "}," +

      "onStateFieldsChangedHandlers: new Map([" +
        Array.from(selfInstance.reactiveStateFieldsKeys).
            map((stateFieldKey: string): string => `[ "${ stateFieldKey }", new Set() ],`).
            join(",") +
      "])," +

      "methodsReferences: new Map()" +

    "}";

  }


  /* ━━━ Private Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private processPugBlock(
    {
      targetPugBlock,
      parentElementVariableName,
      willVariablesBeDeclaredOutsideOfClosure = false,
      mustKeepCurrentDepthLevel = false,
      mustSkipAddingOfElementsToSetOfTopLevelOnes = false
    }: Readonly<{
      targetPugBlock: PugAST.Block;
      parentElementVariableName?: string;
      willVariablesBeDeclaredOutsideOfClosure?: boolean;
      mustKeepCurrentDepthLevel?: boolean;
      mustSkipAddingOfElementsToSetOfTopLevelOnes?: boolean;
    }>
  ): PugBlockProcessingResult {

    const statementsForCurrentBlock: Array<string> = [];
    const directChildrenElementsVariablesNames: Array<string> = [];

    if (!mustKeepCurrentDepthLevel) {
      this.incrementDOM_DepthLevel();
    }


    /* ┅┅┅ Nodes Iteration ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    for (const pugNode of targetPugBlock.nodes) {

      /* ╍╍╍ Tag Node ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
      if (isTagPugNode(pugNode)) {

        const tagNodeAnalyzingResult: TagNodeProcessingResult = this.processTagNode({
          tagNode: pugNode,
          willVariablesBeDeclaredOutsideOfClosure,
          mustSkipAddingOfElementsToSetOfTopLevelOnes
        });

        directChildrenElementsVariablesNames.push(tagNodeAnalyzingResult.assignedElementVariableName);
        statementsForCurrentBlock.push(...tagNodeAnalyzingResult.outputCodeStatements);

        continue;

      }


      /* ╍╍╍ Code Node ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
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
          "if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {",
            `${ parentElementVariableName }.textContent = String(${ pugNode.val });`,
          "}",
          TemplatesCompiler.generateCodeBlockForCodeNode(pugNode, parentElementVariableName)
        );

        continue;

      }


      /* ╍╍╍ Text Node ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
      if (isTextPugNode(pugNode)) {

        if (isNotUndefined(parentElementVariableName)) {
          statementsForCurrentBlock.push(
            "if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {",
              `${ parentElementVariableName }.textContent = "${ pugNode.val }";`,
            "}"
          );
          continue;
        }


        this.nodesCounters[this.currentDepth__numerationFrom0].text++;
        const textNodeVariableName: string = `textNode${ this.currentTextNodePostfix }`;

        directChildrenElementsVariablesNames.push(textNodeVariableName);
        statementsForCurrentBlock.push(
          ...TemplatesCompiler.generateTextNodeVariableInitializingCodeLines({
            textNodeVariableName,
            textNode: pugNode,
            haveElementVariableBeenDeclared: false
          })
        );

        if (!mustSkipAddingOfElementsToSetOfTopLevelOnes && this.currentDepth__numerationFrom0 === 0) {
          this.topLevelElementsAndGenerators.add(textNodeVariableName);
        }

        continue;

      }


      /* ╍╍╍ Conditional Node ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
      if (isConditionalPugNode(pugNode)) {
        statementsForCurrentBlock.push(
          ...this.generateStatementsForLoneIfCondition({
            conditionalPugNode: pugNode,
            parentElementVariableName
          })
        );
      }

    }

    if (!mustKeepCurrentDepthLevel) {
      this.decrementDOM_DepthLevel();
    }

    return {
      outputCodeStatements: statementsForCurrentBlock,
      directChildrenElementsVariablesNames
    };

  }


  /* ┅┅┅ By Nodes Types ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private processTagNode(
    {
      tagNode,
      willVariablesBeDeclaredOutsideOfClosure = false,
      mustSkipAddingOfElementsToSetOfTopLevelOnes = false
    }: Readonly<{
      tagNode: PugAST.Tag;
      willVariablesBeDeclaredOutsideOfClosure?: boolean;
      mustSkipAddingOfElementsToSetOfTopLevelOnes?: boolean;
    }>
  ): TagNodeProcessingResult {

    this.nodesCounters[this.currentDepth__numerationFrom0].element++;

    const elementVariableName: string = `element${ this.currentElementNodePostfix }`;

    if (!mustSkipAddingOfElementsToSetOfTopLevelOnes && this.currentDepth__numerationFrom0 === 0) {
      this.topLevelElementsAndGenerators.add(elementVariableName);
    }

    const statementsForTagNode: Array<string> = [
      ...TemplatesCompiler.generateElementVariableInitializingCodeLines({
        elementVariableName,
        tagNode,
        hasElementVariableBeenDeclared: willVariablesBeDeclaredOutsideOfClosure
      })
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
        "if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {" +
          `${ elementVariableName }.setAttribute("${ attribute.name }", ${ attribute.val.replaceAll("'", "\"") });` +
        "}"
      );

      if (attribute.val.startsWith("$reactiveState.")) {

        const reactiveStateFieldKey: string = attribute.val.replaceAll("$reactiveState.", "");

        statementsForTagNode.push(
          "if (__IS_CSR__YDUR__) {" +
            `this.onStateFieldsChangedHandlers.get("${ reactiveStateFieldKey }").add(value => {` +
              `element_0.setAttribute("${ attribute.name }", String(value));` +
            "});" +
          "}"
        );

        this.reactiveStateFieldsKeys.add(reactiveStateFieldKey);

      }

    }

    if (isNotUndefined(tagNode.block)) {

      const pugBlockProcessingResult: PugBlockProcessingResult =
          this.processPugBlock({ targetPugBlock: tagNode.block, parentElementVariableName: elementVariableName });

      statementsForTagNode.push(...pugBlockProcessingResult.outputCodeStatements);

      if (pugBlockProcessingResult.directChildrenElementsVariablesNames.length > 0) {
        statementsForTagNode.push(
          "if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {" +
            `${ elementVariableName }.append(${ pugBlockProcessingResult.directChildrenElementsVariablesNames.join(",") });` +
          "}"
        );
      }

    }

    return {
      outputCodeStatements: statementsForTagNode,
      assignedElementVariableName: elementVariableName
    };

  }

  private static generateCodeBlockForCodeNode(codeNode: PugAST.Code, parentElementVariableName: string): string {

    if (codeNode.val.startsWith("$reactiveState")) {
      return [
        "if (__IS_CSR__YDUR__) {",
          `this.onStateFieldsChangedHandlers.get("${ codeNode.val.replace("$reactiveState.", "") }").` +
              `add(value => { ${ parentElementVariableName }.textContent = String(value); });`,
        "}"
      ].join("\n");
    }


    return "";

  }

  /* eslint-disable @typescript-eslint/member-ordering -- The method orders must be preserved because of the logic. */
  private generateStatementsForLoneIfCondition(
    {
      conditionalPugNode,
      parentElementVariableName
    }: Readonly<{
      conditionalPugNode: PugAST.Conditional;
      parentElementVariableName?: string;
    }>
  ): Array<string> {

    if (isBlockEmptyOrHasCommentChildrenOnly(conditionalPugNode.consequent)) {
      return [];
    }


    this.nodesCounters[this.currentDepth__numerationFrom0].placeholder++;
    this.nodesCounters[this.currentDepth__numerationFrom0].conditionalRenderer++;

    const placeholderVariableName: string = `placeholder${ this.currentPlaceholderNodePostfix }`;

    const {
      conditionalRendererCode,
      conditionalRendererFunctionName,
      elementsVariables
    }: ConditionalRenderingDeclarationGeneratingResult =

        this.generateLoneIfConditionalRenderingDeclaration({
          placeholderVariableName,
          truthyBranch: conditionalPugNode.consequent
        });


    if (isUndefined(parentElementVariableName)) {
      this.topLevelElementsAndGenerators.add(`...${ conditionalRendererFunctionName }(${ conditionalPugNode.test })`);
    }


    return [
      `let ${ placeholderVariableName };`,
      ...elementsVariables.map((elementVariable: string): string => `let ${ elementVariable };`),
      conditionalRendererCode,
      `this.onStateFieldsChangedHandlers.get("${ conditionalPugNode.test.replace("$reactiveState.", "") }").` +
          `add(${ conditionalRendererFunctionName });`,
      ...isNotUndefined(parentElementVariableName) ?
          [ `${ parentElementVariableName }.append(...${ conditionalRendererFunctionName }(${ conditionalPugNode.test }));` ] :
          []
    ];

  }


  /* ┅┅┅ Declarations ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private static generateElementVariableInitializingCodeLines(
    {
      hasElementVariableBeenDeclared,
      elementVariableName,
      tagNode
    }: Readonly<{
      hasElementVariableBeenDeclared: boolean;
      elementVariableName: string;
      tagNode: PugAST.Tag;
    }>
  ): Array<string> {

    let preDefinedHTML_ID: string | undefined =
        tagNode.attrs.find((attribute: PugAST.Attribute): boolean => attribute.name === "id")?.
        val;

    /*
     * [ Theory ] Pug
     * ● If the ID has been specified as an attribute with a string literal (e. g. `div(id="customID")`), the above `val`
     *   will be wrapped by double questions.
     * ● If the ID has been specified via ID literal (e. g. `div#customID)`, the above `val` will be wrapped by single
     *   quotations.
     * */
    if (isNotUndefined(preDefinedHTML_ID)) {

      if (preDefinedHTML_ID.startsWith("\"") || preDefinedHTML_ID.startsWith("'")) {
        preDefinedHTML_ID = removeNthCharacter(preDefinedHTML_ID, { targetCharacterNumber: 1, numerationFrom: 1 });
      }

      if (preDefinedHTML_ID.endsWith("\"") || preDefinedHTML_ID.endsWith("'")) {
        preDefinedHTML_ID = removeLastCharacter(preDefinedHTML_ID);
      }

    }

    const generatedHTML_ID: string = `${ elementVariableName }--YDUR-TEMP`;

    return [

      ...hasElementVariableBeenDeclared ?
          [] :
          [ `let ${ elementVariableName };` ],

      "if (__IS_UNIVERSAL__YDUR__) {",

        "if (__IS_SSR__YDUR__) {",

          `${ elementVariableName } = document.createElement("${ tagNode.name }");`,

          /* [ Approach ] The custom ID will be set later, with all other attributes. */
          ...isUndefined(preDefinedHTML_ID) ?
              [ `${ elementVariableName }.setAttribute("id", "${ generatedHTML_ID }");` ] : [],

        "} else {",

          `${ elementVariableName } = document.getElementById("${ preDefinedHTML_ID ?? generatedHTML_ID }");`,
          ...isUndefined(preDefinedHTML_ID) ? [ "element_0.removeAttribute(\"id\");" ] : [],

        "}",

      "} else {",
        `${ elementVariableName } = document.createElement("${ tagNode.name }");`,
      "}"

    ];

  }

  private static generateTextNodeVariableInitializingCodeLines(
    {
      haveElementVariableBeenDeclared,
      textNodeVariableName,
      textNode
    }: Readonly<{
      haveElementVariableBeenDeclared: boolean;
      textNodeVariableName: string;
      textNode: PugAST.Text;
    }>
  ): Array<string> {

    /* [ Approach ] Too may work for a plain text in universal mode - on the client side,   */
    return [

      ...haveElementVariableBeenDeclared ?
          [] :
          [ `let ${ textNodeVariableName };` ],

      "if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {",
        `${ textNodeVariableName } = document.createTextNode("${ textNode.val }");`,
      "}"

    ];

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

  private generateLoneIfConditionalRenderingDeclaration(
    {
      placeholderVariableName,
      truthyBranch
    }: Readonly<{
      placeholderVariableName: string;
      truthyBranch: PugAST.Block;
    }>
  ): ConditionalRenderingDeclarationGeneratingResult {

    const conditionalRendererName: string = `conditionalRenderer${ this.currentConditionalRendererNodePostfix }`;

    const {
      outputCodeStatements: elementsInitializationCodeStatements,
      directChildrenElementsVariablesNames: elementsVariables
    }: PugBlockProcessingResult = this.processPugBlock({
        targetPugBlock: truthyBranch,
        mustKeepCurrentDepthLevel: true,
        willVariablesBeDeclaredOutsideOfClosure: true,
        mustSkipAddingOfElementsToSetOfTopLevelOnes: true
      });

    const commaSeparatedElementsVariablesNames: string = elementsVariables.join(", ");

    return {

      conditionalRendererCode: `
        const ${ conditionalRendererName } = value => {

          if (value) {

            if (typeof ${ elementsVariables[0] } === "undefined") {
              ${ elementsInitializationCodeStatements.join("\n") }
            }

            ${ placeholderVariableName }.replaceWith(${ commaSeparatedElementsVariablesNames });

            return [ ${ commaSeparatedElementsVariablesNames } ];

          }


          if (typeof ${ placeholderVariableName } === "undefined") {
            ${ placeholderVariableName } = document.createComment();
          }

          ${ elementsVariables[0] }.replaceWith(${ placeholderVariableName });
          ${
            cropArray({
              targetArray: elementsVariables,
              mutably: false,
              fromStart: true,
              startingElementNumber__numerationFrom1: 2,
              untilLastElement: true,
              mustThrowErrorIfSpecifiedElementsNumbersAreOutOfRange: false
            }).
                map(
                  (subsequentElementName: string): string => `${ subsequentElementName }.remove();`   
                ).
                join("\n")
          }

          return [ ${ placeholderVariableName } ];

        }`,

      conditionalRendererFunctionName: conditionalRendererName,

      elementsVariables

    };

  }


  /* ┅┅┅ Auxiliaries ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ DOM Depth Level Control ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  private incrementDOM_DepthLevel(): void {

    this.currentDepth__numerationFrom0++;

    this.nodesCounters.push({
      element: -1,
      text: -1,
      placeholder: -1,
      conditionalRenderer: -1
    });

  }

  private decrementDOM_DepthLevel(): void {
    this.currentDepth__numerationFrom0--;
  }


  /* ╍╍╍ Nodes Counters ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  private get currentElementNodePostfix(): string {
    return this.nodesCounters.reduce(
      (
        workpiece: string,
        nodeCounterForCurrentlyIteratedDepthLevel: NodesCountersForSpecificDepthLevel,
        currentlyIteratedDepthLevel__numerationFrom0: number
      ): string =>
          (
            currentlyIteratedDepthLevel__numerationFrom0 <= this.currentDepth__numerationFrom0 ?
                `${ workpiece }_${ nodeCounterForCurrentlyIteratedDepthLevel.element }` : workpiece
          ),
          ""
    );
  }

  private get currentTextNodePostfix(): string {
    return this.nodesCounters.reduce(
      (
        workpiece: string,
        nodeCounterForCurrentlyIteratedDepthLevel: NodesCountersForSpecificDepthLevel,
        currentlyIteratedDepthLevel__numerationFrom0: number
      ): string =>
          (
            currentlyIteratedDepthLevel__numerationFrom0 <= this.currentDepth__numerationFrom0 ?
                `${ workpiece }_${ nodeCounterForCurrentlyIteratedDepthLevel.text }` : workpiece
          ),
          ""
    );
  }

  private get currentPlaceholderNodePostfix(): string {
    return this.nodesCounters.reduce(
      (
        workpiece: string,
        nodeCounterForCurrentlyIteratedDepthLevel: NodesCountersForSpecificDepthLevel,
        currentlyIteratedDepthLevel__numerationFrom0: number
      ): string =>
          (
            currentlyIteratedDepthLevel__numerationFrom0 <= this.currentDepth__numerationFrom0 ?
                `${ workpiece }_${ nodeCounterForCurrentlyIteratedDepthLevel.placeholder }` : workpiece
          ),
          ""
    );
  }

  private get currentConditionalRendererNodePostfix(): string {
    return this.nodesCounters.reduce(
      (
        workpiece: string,
        nodeCounterForCurrentlyIteratedDepthLevel: NodesCountersForSpecificDepthLevel,
        currentlyIteratedDepthLevel__numerationFrom0: number
      ): string =>
          (
            currentlyIteratedDepthLevel__numerationFrom0 <= this.currentDepth__numerationFrom0 ?
                `${ workpiece }_${ nodeCounterForCurrentlyIteratedDepthLevel.conditionalRenderer }` : workpiece
          ),
          ""
    );
  }
  /* eslint-enable @typescript-eslint/member-ordering */

}
