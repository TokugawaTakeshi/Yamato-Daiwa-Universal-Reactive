type GeneralizedView = {

  onStateFieldsChangedHandlers: Map<string, Set<(currentValue: unknown) => unknown>>;

  methodsReferences: Map<string, (handler: () => unknown) => unknown>;

  generateInitialDOM: () => Array<Element>;

};


export default GeneralizedView;
