export default {
  generateInitialDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    const element_0 = document.createElement("nav");
    const element_0_0 = document.createElement("ul");
    const element_0_0_0 = document.createElement("li");
    element_0_0_0.textContent = "Top";
    const element_0_0_1 = document.createElement("li");
    element_0_0_1.textContent = "About";
    element_0_0.append(element_0_0_0, element_0_0_1);
    element_0.append(element_0_0);
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
