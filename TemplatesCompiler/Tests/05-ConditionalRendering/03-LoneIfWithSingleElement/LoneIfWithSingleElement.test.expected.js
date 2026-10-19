export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers,
    $parentElement
  }) {
    let placeholder_0;
    let element_0;
    const conditionalRenderer_0 = value => {

      if (typeof element_0 === "undefined") {
        if (__IS_UNIVERSAL__YDUR__) {
          if (__IS_SSR__YDUR__) {
            element_0 = document.createElement("div");
            element_0.setAttribute("id", "element_0--YDUR-TEMP");
          } else {
            element_0 = document.getElementById("element_0--YDUR-TEMP");
            element_0.removeAttribute("id");
          }
        } else {
          element_0 = document.createElement("div");
        }
        if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
          element_0.textContent = "Rendered!";
        }
      }

      if (typeof placeholder_0 === "undefined") {
        if (__IS_UNIVERSAL__YDUR__) {
          if (__IS_SSR__YDUR__) {
            placeholder_0 = document.createComment("Comment Content");
          } else {
            placeholder_0 = $parentElement.childNodes.find(
              childNode => childNode.nodeType === document.COMMENT_NODE
            );
            placeholder_0.nodeValue = "";
          }
        } else {
          placeholder_0 = document.createComment();
        }

      }

      if (value) {
        placeholder_0.replaceWith(element_0);
        return [element_0];
      } else {
        element_0.replaceWith(placeholder_0);
        return [placeholder_0];
      }

    }
    this.onStateFieldsChangedHandlers.get("sampleBooleanFlag").add(conditionalRenderer_0);
    return [...conditionalRenderer_0($reactiveState.sampleBooleanFlag)];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
