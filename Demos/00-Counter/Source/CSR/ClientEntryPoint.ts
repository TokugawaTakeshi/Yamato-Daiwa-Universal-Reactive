import { initializeCSR_Application } from "@yamato-daiwa/universal-reactive/client";
import Counter from "../GUI_Components/Counter";


initializeCSR_Application({
  mountingPointSelector: "#APPLICATION_ROOT",
  rootComponent: Counter
});
