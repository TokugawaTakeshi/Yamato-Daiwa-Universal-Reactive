# Yamato Daiwa Universal Reactive - Webpack Loader 

The Webpack loader for [Yamato Daiwa Universal Reactive](https://www.npmjs.com/package/@yamato-daiwa/universal-reactive),
  the object-oriented programming-based library for the frontend Web+ development alternative to React, Vue, Svelte and
  the like.


## Installation

```
npm i @yamato-daiwa/universal-reactive-templates-compiler @yamato-daiwa/universal-reactive -E 
```

Please make sure that you are installing the above dependencies with common version.


## Setup
### Usage of Pug Pre-processor Only Under the Yamato Daiwa Universal Reactive 

```javascript
{
  
  // ... Usual Webpack configuration
  
  module: {
    rules: [
        
      {
        test: /\.ydur\.pug$/u,
        loader: "@yamato-daiwa/universal-reactive-webpack-loader"
      },
      
      // ... Other loaders
      
    ]
  }
  
}
```

### Usage of Pug pre-processor with Webpack for Different Purposes

In this case, you must to decide the rules how Webpack will decide the appropriate loader.
Here is just the example.

```javascript
{
  
  // ... Usual Webpack configuration 
  
  module: {
    rules: [
      {
        test: /\.pug$/u,
        oneOf: [

          {
            resourceQuery: /^\?vue/u,
            loader: "@webdiscus/pug-loader",
            options: { mode: "html" }
          },

          {
            test: /\.renderer\.pug$/u,
            loader: "@webdiscus/pug-loader",
            options: { mode: "compile" }
          },

          {
            test: /\.ydur\.pug$/u,
            loader: "@yamato-daiwa/universal-reactive-webpack-loader",
            options: {
              debug: true
            }
          },

          {
            loader: "@webdiscus/pug-loader",
            options: { mode: "render" }
          }

        ]
      },

      // ... Other loaders
        
    ]
  }
  
}
```
