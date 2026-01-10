import * as YDFR from "../../../../Source";
import componentTemplate from "./Counter.ydur.pug";


/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
 * Looks like the ESLint bug because the TypeScript is valid. */
@YDFR.View(componentTemplate)
export default class Counter extends YDFR.Component {

  @YDFR.ReactiveState
  protected currentValue: number = 0;

  @YDFR.EventHandler()
  protected onClickIncrementingButton(): void {
    this.currentValue++;
  }

  @YDFR.EventHandler()
  protected onClickDecrementingButton(): void {
    this.currentValue--;
  }

}
