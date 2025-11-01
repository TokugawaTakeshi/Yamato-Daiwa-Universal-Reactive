export default {
  generateInitialDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    const element_0 = document.createElement("div");
    element_0.textContent = "Some text";
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
