export default {
  generateInitialDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {

    new components.ValidatableControlShell({
      label: stateFields.label,
      guidance: stateFields.guidance
    });

    const element_0 = document.createElement("label");
    element_0.setAttribute("for", $constantState.coreElementHTML_ID);
    element_0.setAttribute("id", $constantState.labelElementHTML_ID);
    element_0.textContent = $reactiveState.label;

    const element_1 = document.createElement("input");
    element_1.setAttribute("type", parameters.HTML_type);
    element_1.setAttribute("id", parameters.value);
    element_1.textContent = $reactiveState.label;

    return [ element_0, element_1 ];

  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
