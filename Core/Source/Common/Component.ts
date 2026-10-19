import type GeneralizedView from "./GeneralizedView";
import type EventHandlersDataMap from "./Types/EventHandlersDataMap";
import type EventHandler from "./Decorators/EventHandler";
import type { ArbitraryObject } from "@yamato-daiwa/es-extensions";


export default abstract class Component {

  /** @description Initialized by `View` decorator by the patching of the constructor. */
  public readonly $mount!: (mountingPoint: Element) => void;

  /** @description Initialized by `View` decorator by the patching of the constructor. */
  public readonly $DOM!: ReadonlyArray<Element>;


  /** @description Initialized by `View` decorator by the patching of the constructor. */
  protected readonly $view!: GeneralizedView;


  /* ━━━ Reactive State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /** @description Initialized by `ReactiveState` decorator if this decorator used. */
  protected readonly $reactiveStateFieldsKeys?: ReadonlyArray<string>;

  /** @description Initialized by `View` decorators by the patching of the constructor. */
  protected readonly $reactiveState!: ArbitraryObject;


  /* ━━━ Constant State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /** @description Initialized by `ConstantState` decorator if this decorator used. */
  protected readonly $constantStateFieldsKeys?: ReadonlyArray<string>;

  /** @description Initialized by `ConstantState` or `View` decorators. */
  protected readonly $constantState!: ArbitraryObject;


  /* ━━━ Events Handlers Keys and Options Map ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /** @description Initialized by `EventHandler` decorator if this decorator used. */
  protected readonly $eventHandlersKeysAndOptionsMap?: ReadonlyMap<string, EventHandler.Options>;

  /** @description Initialized by `EventHandler` or `View` decorators. */
  protected readonly $eventsHandlers!: EventHandlersDataMap;

}
