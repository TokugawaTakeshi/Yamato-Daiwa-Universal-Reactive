import type GeneralizedView from "../GeneralizedView";
import type Component from "../Component";
import {
  type ArbitraryObject,
  getExpectedToBeNonUndefinedMapValue,
  isFunctionLike,
  isUndefined
} from "@yamato-daiwa/es-extensions";
import type EventHandler from "./EventHandler";
import type EventHandlersDataMap from "../Types/EventHandlersDataMap";
import convertNonArrayValueToEmptyArray from "../Utils/convertNonArrayValueToEmptyArray";
import convertNonMapValueToEmptyMap from "../Utils/convertNonMapValueToEmptyMap";


type Constructor = {
  prototype: Prototype;
};

type Prototype =
  Component &
  {
    [methodName: string]: () => unknown;
  };


/* [ Theory ]
 * Invoked after memers decorators, but since `{ "target": "ES2023" }` of TypeScript, the members will not be initialized
 *   at the moment of invocation of decorators. */
const View: (generalizedView: GeneralizedView) => ClassDecorator =

    (generalizedView: GeneralizedView): ClassDecorator =>

        <TFunction>(target: TFunction): TFunction => {

          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- ※
          * Although the `target` is a function, no need to call in here. Cast it to the indexable type for accessing to
          *   static properties. */
          const constructor: Constructor = target as unknown as Constructor;

          /* [ Approach ]
           * This time, the constructor must be the type of Component to be extended. There are few examples in
           * official documentation, thus no official documentation with a class-extending example can be referred.
           * According to unofficial articles (https://qiita.com/tminasen/items/a449826e35ab83c1a57b), it is possible. */
          /* @ts-ignore: TS2322 See the comment above. */
          const ComponentClass: typeof Component = constructor;

          /* @ts-ignore: TS2322 According to the same sources mentioned above, the returning of a class is value. */
          return class extends ComponentClass {
            public constructor() {

              super();

              Object.defineProperty(
                this,
                "$view",
                {
                  value: generalizedView,
                  writable: false,
                  configurable: false,
                  enumerable: false
                }
              );


              const reactiveState: ArbitraryObject = {};

              const reactiveStateFieldsKeys: ReadonlyArray<string> =
                  convertNonArrayValueToEmptyArray(Reflect.get(constructor.prototype, "$reactiveStateFieldsKeys"));

              for (const reactiveStateFieldKey of reactiveStateFieldsKeys) {

                const initialValue: unknown = Reflect.get(this, reactiveStateFieldKey);

                reactiveState[reactiveStateFieldKey] = initialValue;

                if (typeof initialValue === "function") {
                  continue;
                }


                Object.defineProperty(

                  this,
                  reactiveStateFieldKey,
                  {

                    get(): unknown {
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
                      * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
                      return this.$reactiveState[reactiveStateFieldKey];
                    },

                    set(newValue: unknown): void {

                      /* [ Theory ] Since ES2023 and with the current implementation, each field is already initialized
                       *   when invoked for the first time. However, it is still can be undefined. */
                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
                      * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
                      const previousValue: unknown = Reflect.get(this.$reactiveState, reactiveStateFieldKey);

                      if (
                        newValue === previousValue &&
                        typeof newValue !== "object" &&
                        typeof previousValue !== "object"
                      ) {
                        return;
                      }


                      if (
                        typeof newValue === "object" &&
                        typeof previousValue === "object" &&
                        JSON.stringify(newValue) === JSON.stringify(previousValue)
                      ) {
                        return;
                      }

                      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
                      * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
                      this.$reactiveState[reactiveStateFieldKey] = newValue;

                      for (
                        const handler of getExpectedToBeNonUndefinedMapValue(
                          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
                           * It is assumed that the `$view` property has been added by the `View` decorator. */
                          (this as { $view: GeneralizedView; }).$view.onStateFieldsChangedHandlers, reactiveStateFieldKey
                        )
                      ) {
                        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access --
                      * It looks like ESLint has not been adapted for accessing to `this` inside `Object.defineProperty`. */
                        handler(this.$reactiveState[reactiveStateFieldKey]);
                      }

                    },

                    enumerable: true,
                    configurable: true

                  }
                );

              }

              Object.defineProperty(
                this,
                "$reactiveState",
                {
                  value: reactiveState,
                  enumerable: false,
                  configurable: false,
                  writable: false
                }
              );


              const constantState: ArbitraryObject = {};

              const constantStateFieldsKeys: ReadonlyArray<string> =
                  convertNonArrayValueToEmptyArray(Reflect.get(constructor.prototype, "$constantStateFieldsKeys"));

              for (const constantStateFieldsKey of constantStateFieldsKeys) {
                constantState[constantStateFieldsKey] = Reflect.get(this, constantStateFieldsKey);
              }

              Object.defineProperty(
                this,
                "$constantState",
                {
                  value: constantState,
                  enumerable: false,
                  configurable: false,
                  writable: false
                }
              );


              const instanceEventHandlersDataMap: EventHandlersDataMap = new Map();

              const eventHandlersKeysAndOptionsMap: Map<string, EventHandler.Options> =
                  convertNonMapValueToEmptyMap(Reflect.get(constructor.prototype, "$eventHandlersKeysAndOptionsMap"));

              for (const [ eventHandlerKey, options ] of eventHandlersKeysAndOptionsMap.entries()) {

                const rawHandler: unknown = Reflect.get(this, eventHandlerKey);

                if (!isFunctionLike(rawHandler)) {
                  continue;
                }


                instanceEventHandlersDataMap.set(
                  eventHandlerKey,
                  {
                    handler: rawHandler.bind(this),
                    options
                  }
                );

               }

              if (isUndefined(this.$eventsHandlers)) {
                Object.defineProperty(
                  this,
                  "$eventsHandlers",
                  {
                    value: instanceEventHandlersDataMap,
                    enumerable: false,
                    configurable: false,
                    writable: false
                  }
                );
              }

              Object.defineProperty(
                this,
                "$DOM",
                {
                  value: generalizedView.initializeDOM({
                    $reactiveState: this.$reactiveState,
                    $constantState: this.$constantState,
                    $eventsHandlers: this.$eventsHandlers
                  }),
                  writable: false,
                  configurable: false,
                  enumerable: false
                }
              );

              Object.defineProperty<Component>(
                this,
                "$mount",
                {
                  value: (mountingPoint: Element): void => {
                    mountingPoint.replaceWith(...this.$DOM);
                  },
                  writable: false,
                  configurable: false,
                  enumerable: false
                }
              );

            }
          };

        };


export default View;
