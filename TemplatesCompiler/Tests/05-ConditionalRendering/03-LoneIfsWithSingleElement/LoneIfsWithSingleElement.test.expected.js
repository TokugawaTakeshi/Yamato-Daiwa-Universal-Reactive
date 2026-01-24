export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let placeholder_0;
    let element_1;
    const conditionalRenderer_0 = value => {

      if (value) {

        if (typeof element_1 === "undefined") {
          element_1 = document.createElement("div");
          element_1.textContent = "Rendered!";
        }

        placeholder_0.replaceWith(element_1);

        return [element_1];

      }


      if (typeof placeholder_0 === "undefined") {
        placeholder_0 = document.createComment();
      }

      element_1.replaceWith(placeholder_0);


      return [placeholder_0];

    }
    this.onStateFieldsChangedHandlers.get("sampleBooleanFlag").add(conditionalRenderer_0);
    return [...conditionalRenderer_0($reactiveState.sampleBooleanFlag)];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
