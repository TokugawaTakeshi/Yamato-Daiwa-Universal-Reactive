import Component from "../Component";
import type EventPropagationTypes from "../Constants/EventPropagationTypes";
import { ImproperUsageError, Logger } from "@yamato-daiwa/es-extensions";


/**
 * @description
 * Been executed BEFORE `View` decorator, thus the methods (and fields) of `Component` class may be not defined yet
 *    (if defined, then it was done by previous invocations of `EventHandler` and/or other fields/method decorators).
 */
const EventHandler: (options?: EventHandler.Options) => MethodDecorator =

    (options: EventHandler.Options = {}): MethodDecorator =>

        (
          componentClassPrototype: object, methodKey: string | symbol
        ): void => {

          if (!(componentClassPrototype instanceof Component)) {
            Logger.throwErrorWithFormattedMessage({
              errorInstance: new ImproperUsageError("The `EventHandler` decorator can be used only for YDUR component classes."),
              title: ImproperUsageError.localization.defaultTitle,
              occurrenceLocation: "EventHandler.MethodDecorator(componentClassPrototype, methodKey, descriptor)"
            });
          }


          const eventHandlersKeysAndOptionsMap: unknown = Reflect.get(componentClassPrototype, "$eventHandlersKeysAndOptionsMap");

          if (eventHandlersKeysAndOptionsMap instanceof Map) {
            eventHandlersKeysAndOptionsMap.set(methodKey, options);
          } else {
            Object.defineProperty(
              componentClassPrototype,
              "$eventHandlersKeysAndOptionsMap",
              {
                value: new Map([ [ methodKey, options ] ]),
                enumerable: false,
                configurable: false,
                writable: false
              }
            );
          }

        };


namespace EventHandler {

  export type Options = Readonly<{
    eventPropagation?: EventPropagationTypes | false;
    mustBeCalledOnce?: boolean;
    mustKeepDefaultBehaviour?: boolean;
  }>;

}


export default EventHandler;
