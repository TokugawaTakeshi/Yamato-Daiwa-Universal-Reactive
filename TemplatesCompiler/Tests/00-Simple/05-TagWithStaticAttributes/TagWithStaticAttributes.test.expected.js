export default {
  generateInitialDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    const element_0 = document.createElement("div");
    element_0.setAttribute("id", "main");
    element_0.setAttribute("class", "box");
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
