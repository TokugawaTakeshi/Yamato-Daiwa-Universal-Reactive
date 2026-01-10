import Component from "../Component";
import {
  ImproperUsageError,
  Logger,
  isUndefined
} from "@yamato-daiwa/es-extensions";


const ConstantState: PropertyDecorator = (componentClassPrototype: object, propertyKey: string | symbol): void => {

  if (!(componentClassPrototype instanceof Component)) {
    Logger.throwErrorWithFormattedMessage({
      errorInstance: new ImproperUsageError("The `StateField` decorator can be used only for YDUR component classes."),
      title: ImproperUsageError.localization.defaultTitle,
      occurrenceLocation: "StateField(componentClassPrototype, propertyKey)"
    });
  }


  if (isUndefined(Reflect.get(componentClassPrototype, "$constantState"))) {
    Object.defineProperty(
      componentClassPrototype,
      "$constantState",
      {
        value: {},
        enumerable: false,
        configurable: false,
        writable: false
      }
    );
  }

  /* [ Approach ]
   * These getter and setter will overwrite the field with the key `propertyKey`.
   * Instead of the original field, the property will be stored to `$constantState`. */
  Object.defineProperty(

    componentClassPrototype,
    propertyKey,
    {

      get(): unknown {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
        return this.$constantState[propertyKey];
      },

      set(newValue: unknown): void {
        Object.defineProperty(
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
           * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
          this.$constantState,
          propertyKey,
          {
            configurable: false,
            writable: false,
            value: newValue
          }
        );
      },

      enumerable: false,
      configurable: false

    }
  );

};


export default ConstantState;
