export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let element_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
      } else {
        element_0 = document.getElementById("customID");
      }
    } else {
      element_0 = document.createElement("div");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("id", "customID");
    }
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
