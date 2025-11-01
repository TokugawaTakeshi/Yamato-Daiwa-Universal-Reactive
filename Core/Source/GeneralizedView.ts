import type EventHandlersDataMap from "./Types/EventHandlersDataMap";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


type GeneralizedView = {

  onStateFieldsChangedHandlers: Map<string, Set<(currentValue: unknown) => unknown>>;

  methodsReferences: Map<string, (handler: () => unknown) => unknown>;

  generateInitialDOM: (parameter: GeneralizedView.InitialDOM_Generating.Parameter) => Array<Element>;

};


namespace GeneralizedView {

  export namespace InitialDOM_Generating {

    export type Parameter = Readonly<{
      $reactiveState: ArbitraryObject;
      $constantState: ArbitraryObject;
      $eventsHandlers: EventHandlersDataMap;
    }>;

  }

}

export default GeneralizedView;
