# Work in progress: NOT READY TO USE.

# vue-light-gallery
A zero-dependency (standalone) VueJS lightweight image gallery for both mobile and desktop browsers.

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

## Usage

```html
<template>
  <div>
    <light-gallery
      :images="images"
      :index="index"
      :disable-scroll="true"
      @close="index = null"
    ></light-gallery>
    <ul>
      <li
        v-for="(image, imageIndex) in images"
        :key="imageIndex"
        class="thumb"
        :style="`background-image: url(${image})`"
        @click="index = imageIndex"
      />
    </ul>
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
      };
    },
  };
</script>
```

Or you can install it globally:

```js
import Vue from 'vue'
import VueLightGallery from 'vue-light-gallery'

Vue.component('light-gallery', VueLightGallery);
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
