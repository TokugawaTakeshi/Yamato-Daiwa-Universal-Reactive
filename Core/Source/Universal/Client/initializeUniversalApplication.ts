import type Component from "../../Common/Component";


export default function initializeUniversalApplication(RootComponent: new () => Component): void {

  /* eslint-disable-next-line no-new --
  * Yes, basically the causing of side effect by the constructor is not good, but here the side effect is caused
  *   by the patched by decorator constructor, while `Component` itself is the abstract class and `new () => Component`
  *   means "inheritor of Component". */
  new RootComponent();

}
