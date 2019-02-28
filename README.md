# vue-light-gallery
VueJS lightweight image gallery for both mobile and desktop browsers.

- Zero-dependencies
- Responsive
- Swipe & Keyboard events
- Lazy load of next/prev images
- Loading spinner

![](example/vue-light-image.gif)

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
    <LightGallery
      :images="images"
      :index="index"
      :disable-scroll="true"
      @close="index = null"
    ></LightGallery>
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
  import Vue from 'vue';
  import LightGallery from 'vue-light-gallery';

  Vue.use(VueLightGallery);

  export default {
    data() {
      return {
        images: [
          'https://picsum.photos/1200/800?image=1024',
          'https://picsum.photos/1000/1000?image=935',
          'https://picsum.photos/800/1200?image=1003',
          'https://picsum.photos/1200/800?image=937',
        ],
        index: null,
      };
    },
  };
</script>
```

You can change the component id by doing:

```html
<template>
  ...
  <custom-gallery ... />
  ...
</template>
<script>
import Vue from 'vue';
import LightGallery from 'vue-light-gallery';

Vue.use(VueLightGallery, { componentId: 'custom-gallery' });
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


## Events

| Name                | Params              | Description                                     |
| --------------------|:--------------------| ------------------------------------------------|
| close               |                     | Triggered when the lightbox is closed           |
| slide               | { index: Number }   | Triggered when the image change (next or prev)  |


## Usage with Nuxt

Create the plugin `lightGallery.client.js`:

```js
import Vue from 'vue';
import VueLightGallery from 'vue-light-gallery';

Vue.use(VueLightGallery);
```

Add the plugin to nuxt.config.js:

```
plugins: [
  '~/plugins/lightGallery.client.js',
],
```

Wrap the component in Nuxt's [`no-ssr` component](https://nuxtjs.org/api/components-no-ssr/).
```html
<no-ssr>
  <LightGallery ... />
</no-ssr>
```

## Allusions
- Inspired by [BaguetteBox](https://github.com/feimosi/baguetteBox.js)
- Spinner extracted from  [epic-spinners](https://github.com/epicmaxco/epic-spinners)
