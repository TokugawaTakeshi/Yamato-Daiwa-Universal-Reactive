export default {
  generateInitialDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    const element_0 = document.createElement("div");
    element_0.textContent = String($reactiveState.someVariable);
    this.onStateFieldsChangedHandlers.get("someVariable").add(value => {
      element_0.textContent = String(value);
    });
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([
    ["someVariable", new Set()],
  ]),
  methodsReferences: new Map()
}
