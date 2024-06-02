import type GeneralizedView from "../GeneralizedView";
import { getExpectedToBeNonUndefinedMapValue } from "@yamato-daiwa/es-extensions";


const StateField: PropertyDecorator = (componentClassPrototype: object, propertyKey: string | symbol): void => {

  /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
  * `PropertyDecorator` requires the first parameter be annotated as `object` but this way it is impossible to access
  *   to any object-specific properties. */
  let currentValue: unknown = (componentClassPrototype as { [key: string | symbol]: unknown; })[propertyKey];

  Object.defineProperty(

    componentClassPrototype,
    propertyKey,
    {

      get(): unknown {
        return currentValue;
      },

      set(newValue: unknown): void {

        const previousValue: unknown = currentValue;

        if (
          newValue === previousValue &&
          typeof newValue !== "object" &&
          typeof newValue !== "function" &&
          typeof previousValue !== "object" &&
          typeof previousValue !== "function"
        ) {
          return;
        }

        currentValue = newValue;

        for (
          const handler of getExpectedToBeNonUndefinedMapValue(
            /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
             * It is assumed that the `$$view` property has been added by the `View` decorator. */
            (this as { $$view: GeneralizedView; }).$$view.onStateFieldsChangedHandlers, propertyKey
          )
        ) {
          handler(currentValue);
        }

      },

      enumerable: true,
      configurable: true

    }
  );

};


export default StateField;
