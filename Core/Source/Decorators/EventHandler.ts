import Component from "../Component";
import type EventPropagationTypes from "../Constants/EventPropagationTypes";
import type EventHandlersDataMap from "../Types/EventHandlersDataMap";
import { ImproperUsageError, Logger } from "@yamato-daiwa/es-extensions";


/**
 * @description
 * Been executed BEFORE `View` decorator, thus the methods (and fields) of `Component` class are not defined yet.
 */
const EventHandler: (options?: EventHandler.Options) => MethodDecorator =

    (options: EventHandler.Options = {}): MethodDecorator =>

        <Function>(
          componentClassPrototype: object, methodKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>
        ): void => {

          if (!(componentClassPrototype instanceof Component)) {
            Logger.throwErrorWithFormattedMessage({
              errorInstance: new ImproperUsageError("The `EventHandler` decorator can be used only for YDUR component classes."),
              title: ImproperUsageError.localization.defaultTitle,
              occurrenceLocation: "EventHandler.MethodDecorator(componentClassPrototype, methodKey, descriptor)"
            });
          }

          /* [ Theory ] Undefined when using the `EventHandler` decorator for the first time inside the specific component. */
          const eventsHandlers__raw: unknown = Reflect.get(componentClassPrototype, "$eventsHandlers");
          let eventsHandlers__reference: EventHandlersDataMap;

          if (eventsHandlers__raw instanceof Map) {

            eventsHandlers__reference = eventsHandlers__raw;

          } else {

            eventsHandlers__reference = new Map();

            Object.defineProperty(
              componentClassPrototype,
              "$eventsHandlers",
              {
                value: eventsHandlers__reference,
                enumerable: false,
                configurable: false,
                writable: false
              }
            );

          }

          eventsHandlers__reference.set(
            String(methodKey),
            {
              /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
               * In `MethodDecorator`, the generic parameter can not be constrained to `() => unknown`, while the `bind`
               *   method is available (if not available, it will be investigated). */
              handler: (descriptor.value as () => unknown).bind(componentClassPrototype),
              options
            }
          );

        };


namespace EventHandler {

  export type Options = Readonly<{
    eventPropagation?: EventPropagationTypes | false;
    mustBeCalledOnce?: boolean;
    mustKeepDefaultBehaviour?: boolean;
  }>;

}


export default EventHandler;
