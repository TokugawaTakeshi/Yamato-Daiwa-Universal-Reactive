import Component from "../Component";
import { ImproperUsageError, Logger } from "@yamato-daiwa/es-extensions";


const ReactiveState: PropertyDecorator = (componentClassPrototype: object, propertyKey: string | symbol): void => {

  if (!(componentClassPrototype instanceof Component)) {
    Logger.throwErrorWithFormattedMessage({
      errorInstance: new ImproperUsageError("The `ReactiveState` decorator can be used only for YDUR component classes."),
      title: ImproperUsageError.localization.defaultTitle,
      occurrenceLocation: "ReactiveState(componentClassPrototype, propertyKey)"
    });
  }


  const reactiveStateFieldsKeys: unknown = Reflect.get(componentClassPrototype, "$reactiveStateFieldsKeys");

  if (Array.isArray(reactiveStateFieldsKeys)) {
    reactiveStateFieldsKeys.push(propertyKey);
  } else {
    Object.defineProperty(
      componentClassPrototype,
      "$reactiveStateFieldsKeys",
      {
        value: [ propertyKey ],
        enumerable: false,
        configurable: false,
        writable: false
      }
    );
  }

};


export default ReactiveState;
