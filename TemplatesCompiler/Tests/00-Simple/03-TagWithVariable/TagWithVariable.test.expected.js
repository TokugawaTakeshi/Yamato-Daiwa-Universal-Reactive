export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
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
