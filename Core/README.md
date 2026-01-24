# Yamato Daiwa Universal Reactive

<figure align="center">
  <img 
    src="https://i.imgur.com/SAH0hKE.jpeg" 
    alt="The decorative image shows that the library is in development."
  >
  <figcaption style="text-align: center;">
    The library is in development. 
    See the <a href="#planned">Features/Planned</a> section to get information about progress.
  </figcaption>
</figure>


## What is Being Developed

The object-oriented programming-based library for the frontend Web+ development alternative to Angular, React, Vue, Svelte,
  and the like.

No plans to position it as a framework because it is intended to be the just the _tool_ taking care of typical frontend 
  development tasks without stealing too much attention and forcing of specific architecture, naming and directories 
  structure. 


## Features

The following feature may be pros of cons depending on your preferences.

+ Class-based components. No functional API planned.
+ [Pug](https://pugjs.org/api/getting-started.html) is the only language for templates. No plain HTML support planned. 
+ No new file names extensions like `.vue` or `.jsx`.
+ No new syntaxes like Vue single file components or JSX. Just plain Pug and TypeScript.
+ Built-in SSR. Unlike Nuxt/Next, the SSR scenario was respected since ealry stage of development
+ The project building tool like Webpack is required.


### Planned

The sequence may be changed during the development.

+ [ ] Conditional rendering
+ [ ] Iterative rendering
+ [ ] Nested components
+ [ ] Routing
+ [ ] Shared state
+ [x] SSR


## Quick Tutorials for Angular/React/Vue/Svelte Experiencers
### Basic ~~"Hello, world"~~ Counter Application
#### Code
##### "Counter.ydfr.pug" — The Component Template

```pug
samp= $reactiveState.currentValue

.Counter-ActionBar

  button(
    type="button"
    @onLeftClick=onClickIncrementingButton
  ) Increment

  button(
    type="button"
    @onLeftClick=onClickDecrementingButton
  ) Decrement
```

The YDUR components templates are been defined by [Pug](https://github.com/pugjs/pug), the template language.
No plans to support HTML.


##### Counter.ts — The Component Logic

```ts
import {
  View,
  ReactiveState,
  Component,
  EventHandler
} from "@yamato-daiwa/universal-reactive";
import componentTemplate from "./Counter.ydur.pug";


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
```

+ The component logic is the plain TypeScript class with decorators.
  Besides its main role, you can use it as the plain TypeScript classes, for example, define
    the public static members and call them from outside (when it makes sense).
+ To import `componentTemplate` from Pug file correctly, you need the appropriate plugin for you project building
    system. 
  Currently, the [Webpack loader](https://www.npmjs.com/package/@yamato-daiwa/universal-reactive-webpack-loader) is available
    and build-in support available only in [https://www.npmjs.com/package/@yamato-daiwa/automation](/@yamato-daiwa/automation).
  The value of `componentTemplate` is _not_ the string with HTML code — the YDUR templates compiler builds the JavaScript 
    object called "the view" based on Pug code.
  Such an approach is Svelte-like, one advantage of it is better performance than DOM diffing as in React.
+ The `currentValue` field has been declared with `@YDFR.ReactiveState` decorator.
  It means the changing of this field will update the DOM depends on it.
  `currentValue` is accessible from template as `$reativeState.currentValue`.
  Contrary to `$reativeState` state, there is the `$constantState` one which does not trigger the re-rendering.
+ The methods are accessible from the template by names as event handlers, but must be decorated by 
  `@YDFR.EventHandler()` decoratory. Unlike `@YDFR.ReactiveState`, it requires `()` becaue optionally the event hanling
  options may be passed.
+ You can make all instance members private in this example, but the **TypeScript** and/all linting tool may complain
  about these fields have not been explicitly used.


##### CSR(SPA) Implementation

Nothing extraordinary in comparison with React or Vue: there is just the initialization function which accepts the
  the options object.
As minimum, it is required to specify the mounting point selector (herewith exatcly one element must corresponding
  to this selector) and the root component (no need to create the instance):

```ts
import { initializeCSR_Application } from "@yamato-daiwa/universal-reactive/client";
import Counter from "../GUI_Components/Counter";


initializeCSR_Application({
  mountingPointSelector: "#APPLICATION_ROOT",
  rootComponent: Counter
});
```

The `initializeCSR_Application` function must be imported from `"@yamato-daiwa/universal-reactive/client"`, 
  not `"@yamato-daiwa/universal-reactive"`.


##### Universal Implementation
###### How It Works

First, how it works.
Unlike React/Next or Vue/Nuxt, in YDUR the SSR scenario is respected from the early stage of development, so it is 
  not the hacky adaptation of another library/framework to SSR.

You are creating the simple server application intended to by build and run by Node.js.
When the server application accepts the request,

1. YDUR generates the script (the JavaScript code for the Browser environment) for the client side. 
   For each application, this script will be unique because includes the logic of _your_ application.
2. YDUR generates the HTML code of the complete page. It will include:
   + The first view or your application
   + The embedded script generated in step 1
3. YDUR will respond with above HTML code.


###### The Project Building Tool 

If you are the user of Next or Nuxt, perhaps you are used to Next or Nuxt suggest the built-in project building
  mechanism, not just SSR functionality.
Is it good?
"Definitely yes! It is effortless to initialize and launch the app!" – many developers will answer, and maybe they are 
  right... but while you are not need the deep customization of the project building tool like the adding of some 
  specific module loaders.
Once you need (what is not so rare for the real project, not simplified synthetic examples for the learning),
  it may become a hard challenge to override the project builders in Next or Nuxt.
It is why the YDUR has not the built-in project building tool – you can use the tools to which you are used to using.


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
Once it defined, the application may be created by one function.
Of course, the HTML element with ID `APPLICATION_ROOT` must exist to initialize the application succesfully. 



### Reactive and Constant State

Some state fields are not intended to be updated during the component lifecycle.
It means no need to make them to a reactive state for performance purposes.
As default, the class fields are not accessible from template, but to declare the constant state field you can use the
  `@YDFR.ConstantState` field:

```ts
import * as YDFR from "@yamato-daiwa/universal-reactive";
import componentTemplate from "./Counter.ydur.pug";


@YDFR.View(componentTemplate)
export default class Counter extends YDFR.Component {

  // Basically, should be set to `readonly` but we will try to change it for experiment.
  @YDFR.ConstantState
  protected heading: string = "Counter";
  
  @YDFR.ReactiveState
  public currentValue: number = 0;

  @YDFR.EventHandler()
  public onClickIncrementingButton(): void {
    
    this.currentValue++;
    
    // You will get TypeError if try to chage it. Of course, DOM dependes in this firld will not be updated.
    this.heading = "NEW HEADING"
    
  }

  @YDFR.EventHandler()
  public onClickDecrementingButton(): void {
    this.currentValue--;
  }

}
```

You can access to `heading` in template via `$constantState` object:

```pug
h1= $constantState.heading

samp= $reativeState.currentValue

.Counter-ActionBar

  button(
    type="button"
    @onLeftClick=onClickIncrementingButton
  ) Increment

  button(
    type="button"
    @onLeftClick=onClickDecrementingButton
  ) Decrement
```


### Events Handling

You can access to instance methods by name from template if they has been decorated by `@YDFR.EventHandler()`:

```ts
@YDFR.View(componentTemplate)
export default class Counter extends YDFR.Component {

  // ...

  @YDFR.EventHandler()
  public onClickIncrementingButton(): void {
    // ...
  }

  @YDFR.EventHandler()
  public onClickDecrementingButton(): void {
    // ...
  }

}
```

Unlike `@YDFR.ReactiveState` or `@YDFR.ConstantState`, `@YDFR.EventHandler` decorator must be invoked because the optons
  may be passed:

```ts
type Options = Readonly<{
  
  /* @default EventPropagationTypes.bubbling */
  eventPropagation?: EventPropagationTypes | false;
  
  /* @default false */
  mustBeCalledOnce?: boolean;
  
  /* @default false */
  mustKeepDefaultBehaviour?: boolean;
  
}>;

enum EventPropagationTypes {
  bubbling = "BUBBLING",
  capturing = "CAPTURING"
}
```

The names of the options has been designed such as does not need any explanations.

If you don't know about **bubbling** and **capturing**, it is a *common* terminology, not terminology of YDR.
Check [this](https://javascript.info/bubbling-and-capturing) tutorial for details.

Once decorated, the method can be referred from the template by the following attributes.

```pug
.Counter-ActionBar

  button(
    type="button"
    @onLeftClick=onClickIncrementingButton
  ) Increment

  button(
    type="button"
    @onLeftClick=onClickDecrementingButton
  ) Decrement
```

Currently available events name listed below.

#### Mouse Events

| YDUR Event Name    | Native event name |
|--------------------|-------------------|
| @onLeftClick       | click             |
| @onDoubleLeftClick | dblclick          |
| @onRightClick      | auxclick          |
| @onMouseDown       | mousedown         |
| @onMouseUp         | mouseup           |
| @onMouseMoved      | mousemove         |
| @onMouseOver       | mouseover         |
| @onMouseOut        | mouseout          |
| @onMouseEntered    | mouseenter        |
| @onMouseLeft       | mouseleave        |


#### Keyboard Events

| YDUR Event Name | Native event name |
|-----------------|-------------------|
| @onKeyPressed   | keyup             |
| @onKeyUp        | keyup             |
| @onKeyDown      | keydown           |
| @onInput        | input             |


#### Common Events

| YDUR Event Name | Native event name |
|-----------------|-------------------|
| @onChange       | change            |
