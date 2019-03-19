<template>
  <transition name="fade">
    <div
      v-if="typeof index === 'number'"
      class="light-gallery"
      @touchstart="touchstartHandler"
      @touchmove="touchmoveHandler"
      @touchend="touchendHandler"
    >
      <div
        class="light-gallery__modal"
        :style="`background: ${background}`"
      >
        <div
          :class="['light-gallery__spinner', !isImageLoaded || 'hide']"
        >
          <div
            class="light-gallery__dot"
            :style="`border-color: ${interfaceColor}`"
          />
          <div
            class="light-gallery__dot"
            :style="`border-color: ${interfaceColor}`"
          />
          <div
            class="light-gallery__dot"
            :style="`border-color: ${interfaceColor}`"
          />
        </div>
        <div class="light-gallery__container">
          <ul class="light-gallery__content">
            <li
              v-for="(image, imageIndex) in formattedImages"
              :key="imageIndex"
              :style="`transform: translate3d(${currentIndex * -100}%, 0px, 0px);`"
              class="light-gallery__image-container"
            >
              <div class="light-gallery__image">
                <div
                  v-show="image.title && isImageLoaded"
                  class="light-gallery__text"
                  :style="`background: ${background}; color: ${interfaceColor}`"
                >
                  {{ image.title }}
                </div>
                <img
                  :ref="`lg-img-${imageIndex}`"
                  :src="shouldPreload(imageIndex) ? image.url : false"
                  @load="imageLoaded($event, imageIndex)"
                >
              </div>
            </li>
          </ul>
        </div>
        <button
          v-if="currentIndex > 0"
          class="light-gallery__prev"
          :style="`background: ${background}`"
          @click="prev()"
        >
          <svg
            width="25"
            height="40"
            viewBox="0 0 25 40"
          >
            <polyline
              points="19 5 5 20 19 35"
              stroke-width="3"
              stroke-linecap="butt"
              fill="none"
              stroke-linejoin="round"
              :stroke="interfaceColor"
            />
          </svg>
        </button>
        <button
          v-if="currentIndex + 1 < images.length"
          class="light-gallery__next"
          :style="`background: ${background}`"
          @click="next()"
        >
          <svg
            width="25"
            height="40"
            viewBox="0 0 25 40"
          >
            <polyline
              points="6 5 20 20 6 35"
              stroke-width="3"
              stroke-linecap="butt"
              fill="none"
              stroke-linejoin="round"
              :stroke="interfaceColor"
            />
          </svg>
        </button>
        <button
          class="light-gallery__close"
          :style="`background: ${background}`"
          @click="close()"
        >
          <svg
            width="30"
            height="30"
          >
            <g
              stroke-width="3"
              :stroke="interfaceColor"
            >
              <line
                x1="5"
                y1="5"
                x2="25"
                y2="25"
              />
              <line
                x1="5"
                y1="25"
                x2="25"
                y2="5"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
const keyMap = {
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
};

export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 1,
    },
    disableScroll: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: 'rgba(0, 0, 0, 0.8)',
    },
    interfaceColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.8)',
    },
  },
  data() {
    return {
      currentIndex: this.index,
      isImageLoaded: false,
      bodyOverflowStyle: '',
      touch: {
        count: 0,
        x: 0,
        y: 0,
        multitouch: false,
        flag: false,
      },
    };
  },
  computed: {
    formattedImages() {
      return this.images.map(image => (typeof image === 'string'
        ? { url: image } : image
      ));
    },
  },
  watch: {
    index(val) {
      if (!document) return;

      this.currentIndex = val;

      if (this.disableScroll && typeof val === 'number') {
        document.body.style.overflow = 'hidden';
      } else if (this.disableScroll && !val) {
        document.body.style.overflow = this.bodyOverflowStyle;
      }
    },
    currentIndex(val) {
      this.setImageLoaded(val);
    },
  },
  mounted() {
    if (!document) return;

    this.bodyOverflowStyle = document.body.style.overflow;
    this.bindEvents();
  },
  beforeDestroy() {
    if (!document) return;

    if (this.disableScroll) {
      document.body.style.overflow = this.bodyOverflowStyle;
    }
    this.unbindEvents();
  },
  methods: {
    close() {
      this.$emit('close');
    },
    prev() {
      if (this.currentIndex === 0) return;
      this.currentIndex -= 1;
      this.$emit('slide', { index: this.currentIndex });
    },
    next() {
      if (this.currentIndex === this.images.length - 1) return;
      this.currentIndex += 1;
      this.$emit('slide', { index: this.currentIndex });
    },
    imageLoaded($event, imageIndex) {
      const { target } = $event;
      target.classList.add('loaded');

      if (imageIndex === this.currentIndex) {
        this.setImageLoaded(imageIndex);
      }
    },
    getImageElByIndex(index) {
      const elements = this.$refs[`lg-img-${index}`] || [];
      return elements[0];
    },
    setImageLoaded(index) {
      const el = this.getImageElByIndex(index);
      this.isImageLoaded = !el ? false : el.classList.contains('loaded');
    },
    shouldPreload(index) {
      const el = this.getImageElByIndex(index) || {};
      const { src } = el;

      return !!src
       || index === this.currentIndex
       || index === this.currentIndex - 1
       || index === this.currentIndex + 1;
    },
    bindEvents() {
      document.addEventListener('keydown', this.keyDownHandler, false);
    },
    unbindEvents() {
      document.removeEventListener('keydown', this.keyDownHandler, false);
    },
    touchstartHandler(event) {
      this.touch.count += 1;
      if (this.touch.count > 1) {
        this.touch.multitouch = true;
      }
      this.touch.x = event.changedTouches[0].pageX;
      this.touch.y = event.changedTouches[0].pageY;
    },
    touchmoveHandler(event) {
      if (this.touch.flag || this.touch.multitouch) return;

      const touchEvent = event.touches[0] || event.changedTouches[0];

      if (touchEvent.pageX - this.touch.x > 40) {
        this.touch.flag = true;
        this.prev();
      } else if (touchEvent.pageX - this.touch.x < -40) {
        this.touch.flag = true;
        this.next();
      }
    },
    touchendHandler() {
      this.touch.count -= 1;
      if (this.touch.count <= 0) {
        this.touch.multitouch = false;
      }
      this.touch.flag = false;
    },
    keyDownHandler(event) {
      switch (event.keyCode) {
        case keyMap.LEFT:
          this.prev();
          break;
        case keyMap.RIGHT:
          this.next();
          break;
        case keyMap.ESC:
          this.close();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.light-gallery {
  &__modal {
    position: fixed;
    display: block;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__content {
    height: 100%;
    width: 100%;
    white-space: nowrap;
    padding: 0;
    margin: 0;
  }

  &__container {
    position: absolute;
    z-index: 1002;
    display: block;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__image-container {
    display: inline-table;
    vertical-align: middle;
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: left .4s ease, transform .4s ease, -webkit-transform .4s ease;
  }

  &__image {
    & {
      display: inline-block;
      position: relative;
      margin: 0 auto;
      max-width: 100%;
      max-height: 100vh;
      // opacity: 0;
    }

    & img {
      & {
        max-width: 100%;
        max-height: 100vh;
        opacity: 0;
        transition: opacity .2s;
      }

      &.loaded{
        opacity: 1;
      }
    }

  }

  &__text {
    position: absolute;
    z-index: 1000;
    bottom: 0;
    display: block;
    margin: 0 auto;
    padding: 12px 30px;
    width: 100%;
    box-sizing: border-box;
  }

  &__next,
  &__prev,
  &__close {
    position: absolute;
    z-index: 1002;
    display: block;
    background: transparent;
    border: 0;
    line-height: 0;
    outline: none;
    padding: 7px;
    cursor: pointer;
  }

  &__next {
    top: 50%;
    transform: translate(0, -50%);
    right: 1.5%;
    vertical-align: middle;
  }

  &__prev {
    top: 50%;
    transform: translate(0, -50%);
    left: 1.5%;
  }

  &__close {
    right: 0;
    padding: 12px;
  }

  &__spinner {
    & {
      position: absolute;
      z-index: 1003;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      display: block;
      height: 15px;
      width: auto;
      box-sizing: border-box;
      text-align: center;
    }

    &.hide {
      display: none;
    }
  }

  &__dot {
    & {
      float: left;
      margin: 0 calc(15px / 2);
      width: 15px;
      height: 15px;
      border: calc(15px / 5) solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      transform: scale(0);
      box-sizing: border-box;
      animation: spinner-animation 1000ms ease infinite 0ms;
    }

    &:nth-child(1) {
      animation-delay: calc(300ms * 1);
    }

    &:nth-child(2) {
      animation-delay: calc(300ms * 2);
    }

    &:nth-child(3) {
      animation-delay: calc(300ms * 3);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  position: fixed;
  z-index: 1000;
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  position: fixed;
  opacity: 0;
  z-index: 1000;
}

@keyframes spinner-animation {
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
