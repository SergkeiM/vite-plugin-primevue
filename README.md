# vite-plugin-prime

Very simple Vite plugin for automatic imports of [PrimeVue](https://github.com/primefaces/primevue/). Ported from [vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin) that was created by [@KaelWD](https://github.com/KaelWD)

## Automatic imports
```js
// vite.config.js
import primevue from 'prime-vite-plugin'

plugins: [
  vue(),
  primeVue()
]
```