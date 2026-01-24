export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let placeholder_0;
    let textNode_1;
    const conditionalRenderer_0 = value => {

      if (value) {

        if (typeof textNode_1 === "undefined") {
          const textNode_1 = document.createTextNode("Text");
        }

        placeholder_0.replaceWith(textNode_1);

        return [textNode_1];

      }


      if (typeof placeholder_0 === "undefined") {
        placeholder_0 = document.createComment();
      }

      textNode_1.replaceWith(placeholder_0);


      return [placeholder_0];

    }
    this.onStateFieldsChangedHandlers.get("sampleBooleanFlag").add(conditionalRenderer_0);
    return [...conditionalRenderer_0($reactiveState.sampleBooleanFlag)];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
