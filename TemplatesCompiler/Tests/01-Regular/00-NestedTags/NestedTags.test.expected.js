export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
    const element_0_0 = document.createElement("button");
    element_0_0.textContent = "Increment";
    const element_0_1 = document.createElement("button");
    element_0_1.textContent = "Decrement";
    element_0.append(element_0_0, element_0_1);
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
