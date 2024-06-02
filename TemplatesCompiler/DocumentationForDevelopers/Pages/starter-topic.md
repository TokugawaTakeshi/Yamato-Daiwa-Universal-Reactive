# Compiler
## View Skeleton

The generated code is neither formatted nor minified because formatting and minifying is indented to be executed by
  external specialized utilities.
If to format the skeleton of generated code, it will be: 

```js
export default {
  generateInitialDOM() {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

generateInitialDOM
: Imperatively generates the initial DOM and adds the event handlers. Returns an array of DOM elements.  

onStateFieldsChangedHandlers
: 
  The map contains the handlers which must be executed on each state field changed.
  + The keys are the state field name.
  + The values are the sets of function-type element. 
    With each state field, the multiple handlers may be associated.

methodsReferences
:
  Contains the references to each method decorated in view model class.
  Will be filled during the binding by the decorator.


## Simple Cases
### Empty Pug Template

For the empty Pug template, the code even with the above view skeleton will be generated.

```js
export default {
  generateInitialDOM() {
    return [];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```


### Lone Tag

```pug
div
```

Single `div` element will be created via `document.createElement()`, then returned.


```js
export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

The `div` element has been assigned to the variable `element_0`.
The template compiler has no target to make the variable names as short as possible, but the utilities with code
  optimization functionality as Webpack can make names of variables extra short. 


### Tag With Text content

```pug
div Some text
```

With be compiled to:

```js
export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
    element_0.textContent = "Some text";
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```


### Tag With Variable Interpolation

```pug
div= someVariable
```

Expected that `someVariable` is declared in View Model object, but it is not under the control of the template compiler.

If some variable will be updated, the content of related elements (in this case `div`) must be updated.
For this, `onStateFieldsChangedHandlers` map stores the handlers by fields name.
The value of map is a set contains the arbitrary value of handlers.
Initially, this set is empty, but it will be filled inside `generateInitialDOM`.

```js
export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
    this.onStateFieldsChangedHandlers.get("someVariable").add(value => {
      element_0.textContent = String(value);
    });
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([
    ["someVariable", new Set()],
  ]),
  methodsReferences: new Map()
}
```


## Typical Cases
### Nested Tags

```pug
div

  button Increment

  button Decrement
```

The nested elements must be appended to parent by [`append` method](https://developer.mozilla.org/en-US/docs/Web/API/Element/append).

```js
export default {
  generateInitialDOM() {
    const element_0 = document.createElement("div");
    const element_0_0 = document.createElement("button");
    element_0_0.textContent = "Increment";
    const element_0_1 = document.createElement("button");
    element_0_1.textContent = "Decrement";
    element_0.append(element_0_0, element_0_1);
    return [element_0];
  },
  onStateFieldsChangedHandlers: new Map([]),
  methodsReferences: new Map()
}
```

For 2nd depth level elements, the double numeration is being used.
