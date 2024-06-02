import type GeneralizedView from "./GeneralizedView";


export default abstract class Component {

  /** @description Initialized by `View` decorator. */
  public readonly $$mount!: (mountingPoint: Element) => void;

  /** @description Initialized by `View` decorator. */
  protected readonly $$DOM!: ReadonlyArray<Element>;

  /** @description Initialized by `View` decorator. */
  protected readonly $$view!: GeneralizedView;

}
