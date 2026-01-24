import Component from "../Component";
import { ImproperUsageError, Logger } from "@yamato-daiwa/es-extensions";


const ConstantState: PropertyDecorator = (componentClassPrototype: object, propertyKey: string | symbol): void => {

  if (!(componentClassPrototype instanceof Component)) {
    Logger.throwErrorWithFormattedMessage({
      errorInstance: new ImproperUsageError("The `ConstantState` decorator can be used only for YDUR component classes."),
      title: ImproperUsageError.localization.defaultTitle,
      occurrenceLocation: "ConstantState(componentClassPrototype, propertyKey)"
    });
  }


  const constantStateFieldsKeys: unknown = Reflect.get(componentClassPrototype, "$constantStateFieldsKeys");

  if (Array.isArray(constantStateFieldsKeys)) {
    constantStateFieldsKeys.push(propertyKey);
  } else {
    Object.defineProperty(
      componentClassPrototype,
      "$constantStateFieldsKeys",
      {
        value: [ propertyKey ],
        enumerable: false,
        configurable: false,
        writable: false
      }
    );
  }

};


export default ConstantState;
