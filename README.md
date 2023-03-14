# vite-plugin-primevue

Very simple Vite plugin for automatic imports of [PrimeVue](https://github.com/primefaces/primevue/). Ported from [vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin) that was created by [@KaelWD](https://github.com/KaelWD)

## Automatic imports
```js
// vite.config.js
import primevue from '@froxz/vite-plugin-primevue'

plugins: [
  vue(),
  primeVue()
]
```

## Options

```js
// vite.config.js
import primevue from '@froxz/vite-plugin-primevue'

plugins: [
  vue(),
  primeVue({
    sfc: true // Read: https://www.primefaces.org/primevue/setup (Single File Components)
  })
]
```

## Caveats

When using this plugin you can define componets in your template as camel, kebab, or lower case, all will produce same result example:

```vue
<template>
    <InputSwitch/>
    <input-switch/>
    <inputswitch/>
</template>
```

Exceptions (Components that have same name as HTML elements:

```vue
<template>
    <Button/> //should be defined as Capitilize
</template>
```