import Component from "../Component";
import type GeneralizedView from "../GeneralizedView";
import {
  getExpectedToBeNonUndefinedMapValue,
  ImproperUsageError,
  Logger,
  isUndefined
} from "@yamato-daiwa/es-extensions";


const ReactiveState: PropertyDecorator = (componentClassPrototype: object, propertyKey: string | symbol): void => {

  if (!(componentClassPrototype instanceof Component)) {
    Logger.throwErrorWithFormattedMessage({
      errorInstance: new ImproperUsageError("The `StateField` decorator can be used only for YDUR component classes."),
      title: ImproperUsageError.localization.defaultTitle,
      occurrenceLocation: "StateField(componentClassPrototype, propertyKey)"
    });
  }


  if (isUndefined(Reflect.get(componentClassPrototype, "$reactiveState"))) {
    Object.defineProperty(
      componentClassPrototype,
      "$reactiveState",
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
   * Instead of the original field, the property will be stored to `$reactiveState`. */
  Object.defineProperty(

    componentClassPrototype,
    propertyKey,
    {

      get(): unknown {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
        return this.$reactiveState[propertyKey];
      },

      set(newValue: unknown): void {

        /* [ Theory ] `undefined` when called for a first time. */
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
        const previousValue: unknown = this.$reactiveState[propertyKey];

        if (
          newValue === previousValue &&
          typeof newValue !== "object" &&
          typeof newValue !== "function" &&
          typeof previousValue !== "object" &&
          typeof previousValue !== "function"
        ) {
          return;
        }


        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
        this.$reactiveState[propertyKey] = newValue;

        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/strict-boolean-expressions --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
        if (!this.$isReactivityEnabled) {
          return;
        }


        for (
          const handler of getExpectedToBeNonUndefinedMapValue(
            /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
             * It is assumed that the `$view` property has been added by the `View` decorator. */
            (this as { $view: GeneralizedView; }).$view.onStateFieldsChangedHandlers, propertyKey
          )
        ) {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
        * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
          handler(this.$reactiveState[propertyKey]);
        }

      },

      enumerable: true,
      configurable: true

    }
  );

};


export default ReactiveState;
