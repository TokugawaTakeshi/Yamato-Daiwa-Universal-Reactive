# Compiler

## View Skeleton

The generated code is neither formatted nor minified because formatting and minifying is indented to be executed by
  the specialized utilities like **js-beautify**.
If to format the skeleton of generated code of an empty template, it will be: 

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

`initializeDOM`
: 

  The behaviour is rendering mode dependent.
  + In CSR applications, generates the initial DOM and adds the events handers
  + In universal applications,
    + At the server side, generates the initial DOM for the subsequent generating of the HTML code 
    + At the client side, adds the event handlers to the HTML code retrieved from the server side
  
  In any case, returns an array of DOM elements (empty array if no DOM elements).
  

onStateFieldsChangedHandlers
: 
  The map contains the handlers which must be executed on each state field changed.
  + The keys are the state field name.
  + The values are the sets of function-type elements. 
    With each state field, the multiple handlers may be associated.

methodsReferences
:
  Contains the references to each method exposed by the `EventHandler` decorator in view model class.
  Will be filled during the binding by the decorator.


## Empty Input

For an empty Pug template, the code even with the above view skeleton will be generated.

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

The same output will be if the source pug file has only the lone comment.

Related tests:

+ Tests/00-EmptyInput
+ Tests/01-LoneEntities/05-LoneComment

## Lone Entities

### Lone Tag

```pug
div
```

+ In universal mode,
  + In SSR case (`__IS_SSR__YDUR__ === true`), the `div` element will be created via `document.createElement()`. 
    The `document` object is mocked by [jsdom](https://www.npmjs.com/package/jsdom).
  + In CSR case (`__IS_SSR__YDUR__ === true`), the `div` element will be captured by the HTML ID.
+ In SPA mode, the `div` will be created by `document.createElement()` as in SSR case, but the `document` object
    will be available in a browser environment.

The capturing by HTML ID is rapid.
Basically, the temporary HTML ID is being generated and then removed once used.

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {

    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
      
    } else {
      element_0 = document.createElement("div");
    }

    return [element_0];

  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

But if the library user has assigned the ID himself, this ID will be used instead and will be not be removed.
The basic logic is as below:

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
      } else {
        element_0 = document.getElementById("customID");
      }
      
    } else {
      element_0 = document.createElement("div");
    }
    
    element_0.setAttribute("id", "customID");
    
    return [element_0];
    
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

But the new line `element_0.setAttribute("id", "customID");` is not required in for the universal mode in client side,
  because the ID already has been set in the server side, so respecting this condition, the final code will be:

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
      } else {
        element_0 = document.getElementById("customID");
      }
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("id", "customID");
    }
    
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```



The `div` element has been assigned to the variable `element_0`.
The template compiler itself has no target to make the variable names as short as possible, but the utilities with code
  optimization functionality like Webpack can make variables' names extra short in the output.

Related tests:

+ Tests/01-LoneEntities/00-LoneTag
+ Tests/01-LoneEntities/01-LoneTagWithID_Attribute
+ Tests/01-LoneEntities/02-LoneTagWithID_Literal
+ Tests/01-LoneEntities/03-LoneID_Literal


### Lone Text Node

```pug
| Hello world
```

+ In universal mode,
  + In SSR case (`__IS_SSR__YDUR__ === true`), the text node will be created by `document.createTextNode()`.
    The `document` object is mocked by [jsdom](https://www.npmjs.com/package/jsdom).
  + In CSR case, it is nothing need to be doce.
+ In CSR-only mode, the text node will be created by `document.createTextNode()`, but the `document` object is available
    in the browser environment.

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let textNode_0;
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      textNode_0 = document.createTextNode("Hello world");
    }
    return [textNode_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests:

+ Tests/01-LoneEntities/04-LoneText


### Lone Comment

```pug
// Some comment
```

The comments are being fully ignored.

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests:

+ Tests/01-LoneEntities/05-LoneComment


## Tag with Content
### Tag with Static Text Content

```pug
div Some text
```

The only significant difference with [lone tag](#lone-tag) scenario is 

```
if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0.textContent = "Some text";
}
```

part:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = "Some text";
    }
    
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests:

+ Tests/02-TagWithContent/00-TagWithTextContent


### Tag With Reactive State Variable Interpolation

```pug
div= $reactiveState.someVariable
```

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
      
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = String($reactiveState.someVariable);
    }
    
    if (__IS_CSR__YDUR__) {
      this.onStateFieldsChangedHandlers.
          get("someVariable").
          add(value => { element_0.textContent = String(value); });
    }
    
    return [element_0];
    
  },
  onStateFieldsChangedHandlers: new Map([
    ["someVariable", new Set()],
  ]),
  methodsReferences: new Map()
}
```

The only difference with the ["Tag with Static Text Content" scenario](#tag-with-static-text-content) is the
  adding of the event handler for the target state variable but only for Client Side Rendering:

```
if (__IS_CSR__YDUR__) {
  this.onStateFieldsChangedHandlers.
      get("someVariable").
      add(value => { element_0.textContent = String(value); });
}
```

Related tests: 

+ Tests/02-TagWithContent/01-TagWithReactiveStateVariableContent


### Tag With Constant State Variable Interpolation

Almode full equivalent of ["Tag with Static Text Content" scenario](#tag-with-static-text-content), just need
  to transform the target constant state variable to the string:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let element_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("div");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = String($constantState.someVariable);
    }
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests: 

+ Tests/02-TagWithContent/02-TagWithConstantStateVariableContent


## Tag with Attributes
### Tag with Static Attributes 

```pug
div(
  id="main"
  class='box'
)
```

No differences in tag creating process with [previously described](#lone-tag).
The attributes are been initialized via `setAttribute` method even in server side for the universal mode, or in client
  side in SPA mode:

```javascript
if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0.setAttribute("id", "main");
}

if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0.setAttribute("class", "box");
}
```

We have one if-statement per the attribute, but the condition will be eliminated by if the project building tool with
  appropriate settings is being used.

Full listing:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
      } else {
        element_0 = document.getElementById("main");
      }
      
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("id", "main");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("class", "box");
    }
    
    return [element_0];
    
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests: 

+ Tests/03-TagWithAttributes/00-Static


### Tag with Attributes Includes the Reactive State Variable

```pug
div(class=$reactiveState.someClass)
```

The only difference with the flow explained in ["Tag with Static Attributes" section](#tag-with-static-attributes) is,
  on client side the `onStateFieldsChangedHandlers` will be registered as in 
  [tag with reactive state variable interpolation case](#tag-with-reactive-state-variable-interpolation):

```javascript
if (__IS_CSR__YDUR__) {
  this.onStateFieldsChangedHandlers.get("someClass").add(value => {
    element_0.setAttribute("class", String(value));
  });
}
```

Full code listing:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
      
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("class", $reactiveState.someClass);
    }
    
    if (__IS_CSR__YDUR__) {
      this.onStateFieldsChangedHandlers.get("someClass").add(value => {
        element_0.setAttribute("class", String(value));
      });
    }
    
    return [element_0];
    
  },
  onStateFieldsChangedHandlers: new Map([
    ["someClass", new Set()],
  ]),
  methodsReferences: new Map()
}
```

Related tests: 

+ Tests/03-TagWithAttributes/01-ReactiveStateVariables


### Tag with Attributes Includes the Constant State variable

```pug
div(class=$constantState.someClass)
```

Already nothing notable if you have read and understood the above content.
Unlike the reactive state, the constant one does not need to trigger the DOM updating:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    let element_0;
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("div");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.setAttribute("class", $constantState.someClass);
    }
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests: 

+ Tests/03-TagWithAttributes/02-ConstantStateVariables


## Multiple Tags

The approach described in ["Tag with Static Text Content" section](#tag-with-static-text-content) is scalable to
  `n` tags at top level.
Compare yourself 2 tags case:


```pug
h1 Rendered!

p Sample
```

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("h1");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("h1");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = "Rendered!";
    }
    
    
    let element_1;
    
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_1 = document.createElement("p");
        element_1.setAttribute("id", "element_1--YDUR-TEMP");
      } else {
        element_1 = document.getElementById("element_1--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_1 = document.createElement("p");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_1.textContent = "Sample";
    }
    
    return [element_0, element_1];
    
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

with previously considered 1 tag case:

```pug
div Some text
```

part:

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    
    let element_0;
    
    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("div");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("div");
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.textContent = "Some text";
    }
    
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Just doubling of code volume in `initializeDOM` method without new approaches.

Related tests:

+ Tests/04-MultipleTags/00-MultipleTagsAtTopLevel


### Nested Tags

```pug
nav

  ul

    li Top

    li About
```

Each tag is being declared according the logic explained above.

```javascript
let element_0;

if (__IS_UNIVERSAL__YDUR__) {
  if (__IS_SSR__YDUR__) {
    element_0 = document.createElement("nav");
    element_0.setAttribute("id", "element_0--YDUR-TEMP");
  } else {
    element_0 = document.getElementById("element_0--YDUR-TEMP");
    element_0.removeAttribute("id");
  }
} else {
  element_0 = document.createElement("nav");
}


let element_0_0;

if (__IS_UNIVERSAL__YDUR__) {
  if (__IS_SSR__YDUR__) {
    element_0_0 = document.createElement("ul");
    element_0_0.setAttribute("id", "element_0_0--YDUR-TEMP");
  } else {
    element_0_0 = document.getElementById("element_0_0--YDUR-TEMP");
    element_0.removeAttribute("id");
  }
} else {
  element_0_0 = document.createElement("ul");
}


let element_0_0_0;

if (__IS_UNIVERSAL__YDUR__) {
  if (__IS_SSR__YDUR__) {
    element_0_0_0 = document.createElement("li");
    element_0_0_0.setAttribute("id", "element_0_0_0--YDUR-TEMP");
  } else {
    element_0_0_0 = document.getElementById("element_0_0_0--YDUR-TEMP");
    element_0.removeAttribute("id");
  }
} else {
  element_0_0_0 = document.createElement("li");
}

if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0_0_0.textContent = "Top";
}

// And so on ...
```

The only different you should notice is, depending on depth level, the variables' names has the specific number of
  of numeration postfixes.
For instance, `element_0_0` is 0th element of 2nd depth level and `element_0_0_0` is the 0th element of 3rd depth level.

The nested tags-specific part is the appending of internal tags to parents:

```javascript
if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0_0.append(element_0_0_0, element_0_0_1);
}

if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
  element_0.append(element_0_0);
}
```

Again, no need to worry about performance impact because computing of conditions for the multiple times: with good 
  bundler like Webpack and correct injecting of global constant, the above code will be optimized to something like 

```javascript
a0.append(a1, a2);
a4.append(a0);
```

when the condition is truthy and completely removed when the condition is falsy.

Full code:

```js
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {

    let element_0;

    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0 = document.createElement("nav");
        element_0.setAttribute("id", "element_0--YDUR-TEMP");
      } else {
        element_0 = document.getElementById("element_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0 = document.createElement("nav");
    }


    let element_0_0;

    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0 = document.createElement("ul");
        element_0_0.setAttribute("id", "element_0_0--YDUR-TEMP");
      } else {
        element_0_0 = document.getElementById("element_0_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0 = document.createElement("ul");
    }


    let element_0_0_0;

    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0_0 = document.createElement("li");
        element_0_0_0.setAttribute("id", "element_0_0_0--YDUR-TEMP");
      } else {
        element_0_0_0 = document.getElementById("element_0_0_0--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0_0 = document.createElement("li");
    }

    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0_0.textContent = "Top";
    }

    
    let element_0_0_1;

    if (__IS_UNIVERSAL__YDUR__) {
      if (__IS_SSR__YDUR__) {
        element_0_0_1 = document.createElement("li");
        element_0_0_1.setAttribute("id", "element_0_0_1--YDUR-TEMP");
      } else {
        element_0_0_1 = document.getElementById("element_0_0_1--YDUR-TEMP");
        element_0.removeAttribute("id");
      }
    } else {
      element_0_0_1 = document.createElement("li");
    }
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0_1.textContent = "About";
    }

    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0_0.append(element_0_0_0, element_0_0_1);
    }
    
    if ((__IS_UNIVERSAL__YDUR__ && __IS_SSR__YDUR__) || (!__IS_UNIVERSAL__YDUR__ && __IS_CSR__YDUR__)) {
      element_0.append(element_0_0);
    }

    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Related tests:

+ Tests/04-MultipleTags/01-NestedTags


## Conditional Rendering (Under Development)
### Lone Empty If

```pug
if $reactiveState.sampleBooleanFlag
```

Will be ignored, no difference with output code with [empty input case](#empty-input).

```javascript
export default {
  initializeDOM({
    $reactiveState,
    $constantState,
    $eventsHandlers
  }) {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

Same result will be if the conditional contains comment only: 

```pug
if $reactiveState.sampleBooleanFlag

  //- Comment
```

Related tests:

+ Tests/05-ConditionalRendering/00-LoneEmptyIf
+ Tests/05-ConditionalRendering/01-LoneIfWithCommentContent
