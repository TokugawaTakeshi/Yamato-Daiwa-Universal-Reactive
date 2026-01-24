import {
  View,
  ReactiveState,
  Component,
  EventHandler
} from "@yamato-daiwa/universal-reactive";
import componentTemplate from "./Counter.ydur.pug";


/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
 * Looks like the ESLint bug because the TypeScript is valid. */
@View(componentTemplate)
export default class Counter extends Component {

  @ReactiveState
  protected currentValue: number = 0;

  @EventHandler()
  protected onClickIncrementingButton(): void {
    this.currentValue++;
  }

  @EventHandler()
  protected onClickDecrementingButton(): void {
    this.currentValue--;
  }

}
