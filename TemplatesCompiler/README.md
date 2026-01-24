# Yamato Daiwa Universal Reactive - Templates Compiler

The templates compiler for [Yamato Daiwa Universal Reactive](https://www.npmjs.com/package/@yamato-daiwa/universal-reactive),
  the object-oriented programming-based library for the frontend Web+ development alternative to React, Vue, Svelte and
  the like.

If you are the user of **Yamato Daiwa Universal Reactive**, not a developer, you don't need to install it manually.


## Required Global Constants

The following global constants are required for the normal operationin of the compiler.
They are been used for the elimination of dead code which not actual for the selected environment.

<dl>

  <dt><code>__IS_UNIVERSAL__YDUR__</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd>boolean</dd>
      <dt>Value</dt>
      <dd>
        <code>true</code> when the application is been built for universal mode (with the server side rendering),
          otherwise <code>false</code>.
      </dd>
    </dl>
  </dd>

  <dt><code>__IS_CSR__YDUR__</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd>boolean</dd>
      <dt>Value</dt>
      <dd><code>true</code> when the target enviroment is a client (browser), otherwise <code>false</code>. </dd>
    </dl>
  </dd>

  <dt><code>__IS_SSR__YDUR__</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd>boolean</dd>
      <dt>Value</dt>
      <dd>
        <code>true</code> when the target enviroment is a server, otherwise <code>false</code>.
        When <code>__IS_SSR__YDUR__</code> it true, it also implies that <code>__IS_UNIVERSAL__YDUR__</code> it 
          <code>true</code> but not always vice versa.
      </dd>
    </dl>
  </dd>

</dl>
