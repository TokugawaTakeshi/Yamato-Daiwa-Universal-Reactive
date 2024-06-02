import type Component from "../Component";

import { getExpectedToBeSingleDOM_Element } from "@yamato-daiwa/es-extensions-browserjs";


export default function initializeFrontendApplication(
  {
    mountingPointSelector,
    rootComponent: RootComponent
  }: Readonly<{
    mountingPointSelector: string;
    rootComponent: new () => Component;
  }>
): void {

  new RootComponent().$$mount(
    getExpectedToBeSingleDOM_Element({
      selector: mountingPointSelector,
      contextElement: document
    })
  );

}
