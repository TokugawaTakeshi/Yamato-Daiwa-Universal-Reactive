import type GeneralizedView from "../GeneralizedView";


type Constructor = {
  prototype: Prototype;
};

type Prototype = {
  [methodName: string]: () => unknown;
};


const View: (generalizedView: GeneralizedView) => ClassDecorator = (generalizedView: GeneralizedView): ClassDecorator =>
  <TFunction>(target: TFunction): TFunction => {

    /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- ※
    * Although the `target` is a function, no need to call in here. Cast it to еру indexable type for accessing to static
    *   properties. */
    const constructor: Constructor = target as unknown as Constructor;

    Object.defineProperty(
      constructor.prototype,
      "$$view",
      {
        value: generalizedView,
        writable: false,
        configurable: false,
        enumerable: false
      }
    );


    const $$DOM: ReadonlyArray<Element> = generalizedView.generateInitialDOM();

    Object.defineProperty(
      constructor.prototype,
      "$$DOM",
      {
        value: $$DOM,
        writable: false,
        configurable: false,
        enumerable: false
      }
    );

    Object.defineProperty(
      constructor.prototype,
      "$$mount",
      {
        value(mountingPoint: Element): void {
          mountingPoint.replaceWith(...$$DOM);
        },
        writable: false,
        configurable: false,
        enumerable: false
      }
    );


    for (const [ methodName, methodReference ] of generalizedView.methodsReferences.entries()) {
      methodReference(constructor.prototype[methodName].bind(constructor.prototype));
    }

    return target;

  };


export default View;
