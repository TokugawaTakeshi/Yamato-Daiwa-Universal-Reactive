import * as YDFR from "../../../../Source";
import componentTemplate from "./Counter.ydur.pug";


/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument --
 * Looks like the ESLint bug because the TypeScript is valid. */
@YDFR.View(componentTemplate)
export default class Counter extends YDFR.Component {

  @YDFR.StateField
  public $currentValue: number = 0;

  public onClickIncrementingButton(): void {
    this.$currentValue++;
  }

  public onClickDecrementingButton(): void {
    this.$currentValue--;
  }

}
