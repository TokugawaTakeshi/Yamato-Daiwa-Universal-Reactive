# Yamato Daiwa Universal Reactive

<figure align="center">
  <img 
    src="https://github.com/user-attachments/assets/c129e15c-4969-4178-8213-c0acfd2b7b47" 
    alt="The decrative image shows that the library is in development."
  >
  <figcaption style="text-align: center;">The library is in development. See the "Roadmap" section for progress.</figcaption>
</figure>


## What is Being Developed

The object-oriented programming-based library for the frontend Web+ development alternative to React, Vue, Svelte and 
  the like.

No plans to position is as a framework because it is intended to be the tool taking care of typical frontend development 
  tasks without stealing too much attention and forcing of specific architecture, naming and directories structure. 


## Features (May be Pros of Cons Depending on Your Preferences)

+ Class-based components. No functional API planned.
+ [Pug](https://pugjs.org/api/getting-started.html) is the only language for templates. No plaing HTML support planned. 
+ No new file names extension like `.vue` or `.jsx`.
+ No new syntaxes like Vue single file components or JSX. Just plain Pug and TypeScript.
+ Project building tool like Webpack is required.


### Planned

The sequence may be changed during the development.

+ [ ] Conditional rendering
+ [ ] Iterative rendering
+ [ ] Nested components
+ [ ] Routing
+ [ ] Shared state
+ [ ] SSR


## Quick Tutorials for React/Vue/Svelte Experiencers
### Basic ~~"Hello, world"~~ Counter Application
#### Code
##### "Counter.ydfr.pug" — The Component Template

```pug
samp= $currentValue

.Counter-ActionBar

  button(
    type="button"
    @click=onClickIncrementingButton
  ) Increment

  button(
    type="button"
    @click=onClickDecrementingButton
  ) Decrement
```

The YDUR components templates is been defined by [Pug](https://github.com/pugjs/pug), the template language.
No plans to support HTML.


##### Counter.ts — The Component Logic

```ts
import * as YDFR from "@yamato-daiwa/universal-reactive";
import componentTemplate from "./Counter.ydur.pug";


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
```

+ The component logic is the plain TypeScript class with decorators.
  Besides its main role, you can use it as the plain TypeScript classes, for example, define
    the public static members and call them from outside (when it makes sense).
* To import `componentTemplate` from Pug file correctly, you need the appropriate plugin for you project building
    system. 
  Currently, the [Webpack loader](https://www.npmjs.com/package/@yamato-daiwa/universal-reactive-webpack-loader) is available.
  The value of `componentTemplate` is not the string with HTML code — the YDUR templates compiler builds the JavaScript 
    object called "View" based on Pug code.
  Such an approach is Svelte-like, one advantage of it is better performance than DOM diffing as in React.


##### index.ts — The Entry Point

```ts
import * as YDFR from "@yamato-daiwa/universal-reactive";
import Counter from "./GUI_Components/Counter";


YDFR.initializeFrontendApplication({
  mountingPointSelector: "#APPLICATION_ROOT",
  rootComponent: Counter
});
```

You need at least one component to create the application instance.
Once it defined, the application may created by one function.
