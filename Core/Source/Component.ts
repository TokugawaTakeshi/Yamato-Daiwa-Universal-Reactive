import type GeneralizedView from "./GeneralizedView";
import type EventHandlersDataMap from "./Types/EventHandlersDataMap";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


export default abstract class Component {

  /** @description Initialized by `View` decorator. */
  public readonly $mount!: (mountingPoint: Element) => void;

  /** @description Initialized by `View` decorator. */
  protected readonly $DOM!: ReadonlyArray<Element>;

  /** @description Initialized by `View` decorator. */
  protected readonly $view!: GeneralizedView;

  /** @description Initialized by `ReactiveState` or `View` decorators. */
  protected readonly $reactiveState!: ArbitraryObject;

  /** @description Initialized by `ConstantState` or `View` decorators. */
  protected readonly $constantState!: ArbitraryObject;

  /** @description Initialized and frozen by `View` decorator. */
  protected readonly $isReactivityEnabled!: false;

  /** @description Initialized by `EventHandler` or `View` decorators. */
  protected readonly $eventsHandlers!: EventHandlersDataMap;

}
