export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let element_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("h1");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("h1");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = "Rendered!";
    }
    let element_1;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_1 = document.createElement("p");
        element_1.setAttribute("id", "element_1--YDUR-TEMP");
      } else {
        element_1 = document.getElementById("element_1--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_1 = document.createElement("p");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_1.textContent = "Sample";
    }
    return [element_0, element_1];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
