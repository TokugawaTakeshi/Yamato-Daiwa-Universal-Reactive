import type EventHandler from "../Decorators/EventHandler";


type EventHandlersDataMap = Map<EventHandlersDataMap.MethodName, EventHandlersDataMap.Payload>;


namespace EventHandlersDataMap {

  export type MethodName = string;

  export type Payload = {
    handler: (event: Event) => unknown;
    options: EventHandler.Options;
  };

}


export default EventHandlersDataMap;
