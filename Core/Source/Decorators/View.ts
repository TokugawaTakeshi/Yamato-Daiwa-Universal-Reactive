import type GeneralizedView from "../GeneralizedView";
import type Component from "../Component";
import { isUndefined } from "@yamato-daiwa/es-extensions";


type Constructor = {
  prototype: Prototype;
};

type Prototype =
  Component &
  {
    [methodName: string]: () => unknown;
  };


/**
 * @description
 * If class component uses "ReactiveState" decorator, "View" decorator will be called AFTER "ReactiveState" thus to
 *   access the reactive state, the patching of the constructor is required.
 */
const View: (generalizedView: GeneralizedView) => ClassDecorator =

    (generalizedView: GeneralizedView): ClassDecorator =>

        <TFunction>(target: TFunction): TFunction => {

          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- ※
          * Although the `target` is a function, no need to call in here. Cast it to еру indexable type for accessing to
          *   static properties. */
          const constructor: Constructor = target as unknown as Constructor;

          Object.defineProperty(
            constructor.prototype,
            "$view",
            {
              value: generalizedView,
              writable: false,
              configurable: false,
              enumerable: false
            }
          );


          /* [ Approach ]
           * This time, the constructor must be the type of Component to be extended. There are not many examples in
           * official documentation, thus no official documentation with a class extending example can be referred.
           * According to unofficial articles (https://qiita.com/tminasen/items/a449826e35ab83c1a57b), it is possible. */
          /* @ts-ignore: TS2322 See the comment above. */
          const ComponentClass: typeof Component = constructor;

          /* @ts-ignore: TS2322 According to the same sources mentioned above, the returning of a class is value. */
          return class extends ComponentClass {
            public constructor() {

              super();

              if (isUndefined(this.$reactiveState)) {

                /* [ Approach ]
                 * If the `ReactiveState` decorator has not been used for the target class, the $reactive state is
                 * undefined yet. Unlike `ReactiveState`, the `View` decorator is required for YDUR components. */

                Object.defineProperty(
                  this,
                  "$reactiveState",
                  {
                    value: {},
                    enumerable: false,
                    configurable: false,
                    writable: false
                  }
                );

              }

              if (isUndefined(this.$constantState)) {

                /* [ Approach ]
                 * If the `ConstantState` decorator has not been used for the target class, the $reactive state is
                 * undefined yet. Unlike `ConstantState`, the `View` decorator is required for YDUR components. */

                Object.defineProperty(
                  this,
                  "$constantState",
                  {
                    value: {},
                    enumerable: false,
                    configurable: false,
                    writable: false
                  }
                );

              }

              if (isUndefined(this.$eventsHandlers)) {
                Object.defineProperty(
                  this,
                  "$eventsHandlers",
                  {
                    value: new Map(),
                    enumerable: false,
                    configurable: false,
                    writable: false
                  }
                );
              }

              Object.defineProperty(
                constructor.prototype,
                "$DOM",
                {
                  value: generalizedView.generateInitialDOM({
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
                constructor.prototype,
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

              /* [ Approach ] No need to change "$isReactivityEnabled" anymore, freezing. */
              Object.defineProperty(
                constructor.prototype,
               "$isReactivityEnabled",
                {
                  value: true,
                  configurable: false,
                  enumerable: false,
                  writable: false
                }
              );

            }
          };

        };


export default View;
