export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let placeholder_0;
    let element_1;
    let element_2;
    const conditionalRenderer_0 = value => {

      if (value) {

        if (typeof element_1 === "undefined") {
          element_1 = document.createElement("h1");
          element_1.textContent = "Rendered!";
          element_2 = document.createElement("p");
          element_2.textContent = "Sample";
        }

        placeholder_0.replaceWith(element_1, element_2);

        return [element_1, element_2];

      }


      if (typeof placeholder_0 === "undefined") {
        placeholder_0 = document.createComment();
      }

      element_1.replaceWith(placeholder_0);
      element_2.remove();

      return [placeholder_0];

    }
    this.onStateFieldsChangedHandlers.get("sampleBooleanFlag").add(conditionalRenderer_0);
    return [...conditionalRenderer_0($reactiveState.sampleBooleanFlag)];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
