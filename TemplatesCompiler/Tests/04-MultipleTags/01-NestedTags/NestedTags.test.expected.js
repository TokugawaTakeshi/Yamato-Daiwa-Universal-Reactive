export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let element_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("nav");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("nav");
    }
    let element_0_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0 = document.createElement("ul");
        element_0_0.setAttribute("id", "element_0_0--YDUR-TEMP");
      } else {
        element_0_0 = document.getElementById("element_0_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0 = document.createElement("ul");
    }
    let element_0_0_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0_0 = document.createElement("li");
        element_0_0_0.setAttribute("id", "element_0_0_0--YDUR-TEMP");
      } else {
        element_0_0_0 = document.getElementById("element_0_0_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0_0 = document.createElement("li");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0_0.textContent = "Top";
    }
    let element_0_0_1;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0_1 = document.createElement("li");
        element_0_0_1.setAttribute("id", "element_0_0_1--YDUR-TEMP");
      } else {
        element_0_0_1 = document.getElementById("element_0_0_1--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0_1 = document.createElement("li");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0_1.textContent = "About";
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0.append(element_0_0_0, element_0_0_1);
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.append(element_0_0);
    }
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
