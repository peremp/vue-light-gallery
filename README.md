# Work in progress: NOT READY TO USE. 

# vue-light-gallery
A zero-dependency standalone VueJS lightweight image gallery for both mobile and desktop browsers.
Inspired by BaguetteBox.js

## License

MIT License

## install

```bash
// Yarn
yarn add vue-light-gallery

// NPM
npm install vue-light-gallery
```

Default install. The component identifier is set to 'lightweight-gallery'.
```js
import Vue from 'vue'
import VueLightGallery from 'vue-light-gallery'

Vue.use(VueLightGallery);
```

To not install the component globally
```
Vue.use(VueLightGallery, { global: false })
```

To install the component globally with a different component id
```
Vue.use(VueLightGallery, { global: true, componentId: "foo-gallery" })
```

or

```html
<script src="vue-light-gallery.min.js"></script>
<script>
Vue.use(VueLightGallery)
</script>
```

## Usage

Pass an array of image urls to the component.

```html
<template>
  <div>
    <light-gallery
      :images="images"
      :index="index"
      @close="index = null"
    ></light-gallery>
    <img
      v-for="(thumb, imageIndex) in thumbnails"
      :key="imageIndex"
      :src="thumb"
      style="padding: 4px; cursor: pointer;"
      @click="index = imageIndex"
    />
  </div>
</template>

<script>
  import VueLightGallery from 'vue-light-gallery';

  export default {
    components: {
      'light-gallery': VueLightGallery,
    },
    data() {
      return {
        images: [
          'https://dummyimage.com/800/ffffff/000000',
          'https://dummyimage.com/1600/ffffff/000000',
          'https://dummyimage.com/1280/000000/ffffff',
          'https://dummyimage.com/400/000000/ffffff',
        ],
        index: null,
        thumbnails: [
          'http://lorempixel.com/150/150/nature/1/',
          'http://lorempixel.com/150/150/nature/2/',
          'http://lorempixel.com/150/150/nature/3/',
          'http://lorempixel.com/150/150/nature/4/'
        ],
      };
    },
  };
</script>
```

## Props

| Props               | Type      | Default                                         | Description                   |
| --------------------|:----------| ------------------------------------------------|-------------------------------|
| images              | Array     | []                                              | Urls list                     |
| index               | Number    | null                                            | index of the displayed image  |
| disableScroll       | Boolean   | false                                           | Disable the scroll            |
| background          | String    | rgba(0, 0, 0, 0.8)                              | Main container background     |
| interfaceColor      | String    | rgba(255, 255, 255, 0.8)                        | Icons color                   |


## Usage with Nuxt

Wrap it in Nuxt's [`no-ssr` component](https://nuxtjs.org/api/components-no-ssr/).
