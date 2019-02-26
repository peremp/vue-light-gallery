var keyMap = {
  LEFT: 37,
  RIGHT: 39,
  ESC: 27,
};
var script = {
  props: {
    images: {
      type: Array,
      default: function () { return []; },
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
  data: function data() {
    return {
      currentIndex: this.index,
      bodyOverflowStyle: document.body.style.overflow,
      touch: {
        count: 0,
        x: 0,
        y: 0,
        multitouch: false,
        flag: false,
      },
    };
  },
  computed: {},
  watch: {
    index: function index(val) {
      this.currentIndex = val;
      if (this.disableScroll && typeof val === 'number') {
        document.body.style.overflow = 'hidden';
      } else if (this.disableScroll && !val) {
        document.body.style.overflow = this.bodyOverflowStyle;
      }
    },
  },
  mounted: function mounted() {
    this.bindEvents();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.disableScroll) {
      document.body.style.overflow = this.bodyOverflowStyle;
    }
    this.unbindEvents();
  },
  methods: {
    close: function close() {
      this.$emit('close');
    },
    prev: function prev() {
      if (this.currentIndex === 0) { return; }
      this.currentIndex -= 1;
      this.$emit('slide', { index: this.currentIndex });
    },
    next: function next() {
      if (this.currentIndex === this.images.length - 1) { return; }
      this.currentIndex += 1;
      this.$emit('slide', { index: this.currentIndex });
    },
    preload: function preload(imageIndex) {
      return imageIndex === this.currentIndex
       || imageIndex === this.currentIndex - 1
       || imageIndex === this.currentIndex + 1;
    },
    bindEvents: function bindEvents() {
      document.addEventListener('keydown', this.keyDownHandler, false);
    },
    unbindEvents: function unbindEvents() {
      document.removeEventListener('keydown', this.keyDownHandler, false);
    },
    touchstartHandler: function touchstartHandler(event) {
      this.touch.count += 1;
      if (this.touch.count > 1) {
        this.touch.multitouch = true;
      }
      this.touch.x = event.changedTouches[0].pageX;
      this.touch.y = event.changedTouches[0].pageY;
    },
    touchmoveHandler: function touchmoveHandler(event) {
      if (this.touch.flag || this.touch.multitouch) { return; }
      var touchEvent = event.touches[0] || event.changedTouches[0];
      if (touchEvent.pageX - this.touch.x > 40) {
        this.touch.flag = true;
        this.prev();
      } else if (touchEvent.pageX - this.touch.x < -40) {
        this.touch.flag = true;
        this.next();
      }
    },
    touchendHandler: function touchendHandler() {
      this.touch.count -= 1;
      if (this.touch.count <= 0) {
        this.touch.multitouch = false;
      }
      this.touch.flag = false;
    },
    keyDownHandler: function keyDownHandler(event) {
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

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  }
  var options = typeof script === 'function' ? script.options : script;
  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true;
    if (isFunctionalTemplate) {
      options.functional = true;
    }
  }
  if (scopeId) {
    options._scopeId = scopeId;
  }
  var hook;
  if (moduleIdentifier) {
    hook = function hook(context) {
      context = context ||
      this.$vnode && this.$vnode.ssrContext ||
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      }
      if (style) {
        style.call(this, createInjectorSSR(context));
      }
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }
  if (hook) {
    if (options.functional) {
      var originalRender = options.render;
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }
  return script;
}
var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};
function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });
  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;
    if (css.map) {
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }
    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }
    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}
var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", { attrs: { name: "fade" } }, [
    typeof _vm.index === "number"
      ? _c(
          "div",
          {
            staticClass: "light-gallery",
            on: {
              touchstart: _vm.touchstartHandler,
              touchmove: _vm.touchmoveHandler,
              touchend: _vm.touchendHandler
            }
          },
          [
            _c(
              "div",
              {
                staticClass: "light-gallery__modal",
                style: "background: " + _vm.background
              },
              [
                _c("div", { staticClass: "light-gallery__container" }, [
                  _c(
                    "ul",
                    { staticClass: "light-gallery__content" },
                    _vm._l(_vm.images, function(image, imageIndex) {
                      return _c(
                        "li",
                        {
                          key: imageIndex,
                          staticClass: "light-gallery__image",
                          style:
                            "transform: translate3d(" +
                            _vm.currentIndex * -100 +
                            "%, 0px, 0px);"
                        },
                        [
                          _vm.preload(imageIndex)
                            ? _c("img", {
                                attrs: { src: _vm.images[imageIndex] }
                              })
                            : _vm._e()
                        ]
                      )
                    }),
                    0
                  )
                ]),
                _vm._v(" "),
                _vm.currentIndex > 0
                  ? _c(
                      "button",
                      {
                        staticClass: "light-gallery__prev",
                        style: "background: " + _vm.background,
                        on: {
                          click: function($event) {
                            return _vm.prev()
                          }
                        }
                      },
                      [
                        _c("svg", [
                          _c("polyline", {
                            attrs: {
                              points: "30 10 10 30 30 50",
                              "stroke-width": "4",
                              "stroke-linecap": "butt",
                              fill: "none",
                              "stroke-linejoin": "round",
                              stroke: _vm.interfaceColor
                            }
                          })
                        ])
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.currentIndex + 1 < _vm.images.length
                  ? _c(
                      "button",
                      {
                        staticClass: "light-gallery__next",
                        style: "background: " + _vm.background,
                        on: {
                          click: function($event) {
                            return _vm.next()
                          }
                        }
                      },
                      [
                        _c("svg", [
                          _c("polyline", {
                            attrs: {
                              points: "14 10 34 30 14 50",
                              "stroke-width": "4",
                              "stroke-linecap": "butt",
                              fill: "none",
                              "stroke-linejoin": "round",
                              stroke: _vm.interfaceColor
                            }
                          })
                        ])
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "light-gallery__close",
                    style: "background: " + _vm.background,
                    on: {
                      click: function($event) {
                        return _vm.close()
                      }
                    }
                  },
                  [
                    _c("svg", { attrs: { width: "30", height: "30" } }, [
                      _c(
                        "g",
                        {
                          attrs: {
                            "stroke-width": "4",
                            stroke: _vm.interfaceColor
                          }
                        },
                        [
                          _c("line", {
                            attrs: { x1: "5", y1: "5", x2: "25", y2: "25" }
                          }),
                          _vm._v(" "),
                          _c("line", {
                            attrs: { x1: "5", y1: "25", x2: "25", y2: "5" }
                          })
                        ]
                      )
                    ])
                  ]
                )
              ]
            )
          ]
        )
      : _vm._e()
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-3c8ee6e7_0", { source: ".light-gallery__modal[data-v-3c8ee6e7] {\n  position: fixed;\n  display: block;\n  z-index: 1001;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.light-gallery__content[data-v-3c8ee6e7] {\n  height: 100%;\n  width: 100%;\n  white-space: nowrap;\n  padding: 0;\n  margin: 0;\n  overflow: hidden;\n}\n.light-gallery__container[data-v-3c8ee6e7] {\n  position: absolute;\n  display: block;\n  width: 100%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.light-gallery__image[data-v-3c8ee6e7] {\n  display: inline-table;\n  vertical-align: middle;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: left .4s ease, transform .4s ease, -webkit-transform .4s ease;\n}\n.light-gallery__image img[data-v-3c8ee6e7] {\n  display: block;\n  margin: 0 auto;\n  max-width: 100%;\n}\n.light-gallery__next[data-v-3c8ee6e7], .light-gallery__prev[data-v-3c8ee6e7], .light-gallery__close[data-v-3c8ee6e7] {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  background: transparent;\n  border: 0;\n  line-height: 0;\n  outline: none;\n  padding: 0;\n  cursor: pointer;\n}\n.light-gallery__next svg[data-v-3c8ee6e7], .light-gallery__prev svg[data-v-3c8ee6e7], .light-gallery__close svg[data-v-3c8ee6e7] {\n    width: 44px;\n    height: 60px;\n}\n.light-gallery__next[data-v-3c8ee6e7] {\n  top: 50%;\n  transform: translate(0, -50%);\n  right: 1.5%;\n  vertical-align: middle;\n}\n.light-gallery__prev[data-v-3c8ee6e7] {\n  top: 50%;\n  transform: translate(0, -50%);\n  left: 1.5%;\n}\n.light-gallery__close[data-v-3c8ee6e7] {\n  right: 0;\n  padding: 20px;\n}\n.light-gallery__close svg[data-v-3c8ee6e7] {\n  width: 30px;\n  height: 30px;\n}\n.fade-enter-active[data-v-3c8ee6e7], .fade-leave-active[data-v-3c8ee6e7] {\n  position: fixed;\n  z-index: 1000;\n  transition: opacity .2s;\n}\n.fade-enter[data-v-3c8ee6e7], .fade-leave-to[data-v-3c8ee6e7] {\n  position: fixed;\n  opacity: 0;\n  z-index: 1000;\n}\n\n/*# sourceMappingURL=light-gallery.vue.map */", map: {"version":3,"sources":["/home/pere.monfort/code/vue-light-gallery/src/light-gallery.vue","light-gallery.vue"],"names":[],"mappings":"AAyOA;EACA,eAAA;EACA,cAAA;EACA,aAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,gBAAA;AAAA;AAGA;EACA,YAAA;EACA,WAAA;EACA,mBAAA;EACA,UAAA;EACA,SAAA;EACA,gBAAA;AAAA;AAGA;EACA,kBAAA;EACA,cAAA;EACA,WAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;AAAA;AAGA;EAEA,qBAAA;EACA,sBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,yEAAA;AAAA;AARA;EAYA,cAAA;EACA,cAAA;EACA,eAAA;AAAA;AAIA;EAGA,kBAAA;EACA,aAAA;EACA,cAAA;EACA,uBAAA;EACA,SAAA;EACA,cAAA;EACA,aAAA;EACA,UAAA;EACA,eAAA;AAAA;AAXA;IAcA,WAAA;IACA,YAAA;AAAA;AAIA;EACA,QAAA;EACA,6BAAA;EACA,WAAA;EACA,sBAAA;AAAA;AAGA;EACA,QAAA;EACA,6BAAA;EACA,UAAA;AAAA;AAGA;EAEA,QAAA;EACA,aAAA;AAAA;AAHA;EAOA,WAAA;EACA,YAAA;AAAA;AAIA;EACA,eAAA;EACA,aAAA;EACA,uBAAA;AAAA;AAEA;EACA,eAAA;EACA,UAAA;EACA,aAAA;AAAA;;ACzPA,4CAA4C","file":"light-gallery.vue","sourcesContent":["<template>\n  <transition name=\"fade\">\n    <div\n      v-if=\"typeof index === 'number'\"\n      class=\"light-gallery\"\n      @touchstart=\"touchstartHandler\"\n      @touchmove=\"touchmoveHandler\"\n      @touchend=\"touchendHandler\"\n    >\n      <div\n        class=\"light-gallery__modal\"\n        :style=\"`background: ${background}`\"\n      >\n        <div class=\"light-gallery__container\">\n          <ul class=\"light-gallery__content\">\n            <li\n              v-for=\"(image, imageIndex) in images\"\n              :key=\"imageIndex\"\n              :style=\"`transform: translate3d(${currentIndex * -100}%, 0px, 0px);`\"\n              class=\"light-gallery__image\"\n            >\n              <img\n                v-if=\"preload(imageIndex)\"\n                :src=\"images[imageIndex]\"\n              >\n            </li>\n          </ul>\n        </div>\n        <button\n          v-if=\"currentIndex > 0\"\n          class=\"light-gallery__prev\"\n          :style=\"`background: ${background}`\"\n          @click=\"prev()\"\n        >\n          <svg>\n            <polyline\n              points=\"30 10 10 30 30 50\"\n              stroke-width=\"4\"\n              stroke-linecap=\"butt\"\n              fill=\"none\"\n              stroke-linejoin=\"round\"\n              :stroke=\"interfaceColor\"\n            />\n          </svg>\n        </button>\n        <button\n          v-if=\"currentIndex + 1 < images.length\"\n          class=\"light-gallery__next\"\n          :style=\"`background: ${background}`\"\n          @click=\"next()\"\n        >\n          <svg>\n            <polyline\n              points=\"14 10 34 30 14 50\"\n              stroke-width=\"4\"\n              stroke-linecap=\"butt\"\n              fill=\"none\"\n              stroke-linejoin=\"round\"\n              :stroke=\"interfaceColor\"\n            />\n          </svg>\n        </button>\n        <button\n          class=\"light-gallery__close\"\n          :style=\"`background: ${background}`\"\n          @click=\"close()\"\n        >\n          <svg\n            width=\"30\"\n            height=\"30\"\n          >\n            <g\n              stroke-width=\"4\"\n              :stroke=\"interfaceColor\"\n            >\n              <line\n                x1=\"5\"\n                y1=\"5\"\n                x2=\"25\"\n                y2=\"25\"\n              />\n              <line\n                x1=\"5\"\n                y1=\"25\"\n                x2=\"25\"\n                y2=\"5\"\n              />\n            </g>\n          </svg>\n        </button>\n      </div>\n    </div>\n  </transition>\n</template>\n\n<script>\nconst keyMap = {\n  LEFT: 37,\n  RIGHT: 39,\n  ESC: 27,\n};\n\nexport default {\n  props: {\n    images: {\n      type: Array,\n      default: () => [],\n    },\n    index: {\n      type: Number,\n      default: 1,\n    },\n    disableScroll: {\n      type: Boolean,\n      default: false,\n    },\n    background: {\n      type: String,\n      default: 'rgba(0, 0, 0, 0.8)',\n    },\n    interfaceColor: {\n      type: String,\n      default: 'rgba(255, 255, 255, 0.8)',\n    },\n  },\n  data() {\n    return {\n      currentIndex: this.index,\n      bodyOverflowStyle: document.body.style.overflow,\n      touch: {\n        count: 0,\n        x: 0,\n        y: 0,\n        multitouch: false,\n        flag: false,\n      },\n    };\n  },\n  computed: {},\n  watch: {\n    index(val) {\n      this.currentIndex = val;\n\n      if (this.disableScroll && typeof val === 'number') {\n        document.body.style.overflow = 'hidden';\n      } else if (this.disableScroll && !val) {\n        document.body.style.overflow = this.bodyOverflowStyle;\n      }\n    },\n  },\n  mounted() {\n    this.bindEvents();\n  },\n  beforeDestroy() {\n    if (this.disableScroll) {\n      document.body.style.overflow = this.bodyOverflowStyle;\n    }\n    this.unbindEvents();\n  },\n  methods: {\n    close() {\n      this.$emit('close');\n    },\n    prev() {\n      if (this.currentIndex === 0) return;\n      this.currentIndex -= 1;\n      this.$emit('slide', { index: this.currentIndex });\n    },\n    next() {\n      if (this.currentIndex === this.images.length - 1) return;\n      this.currentIndex += 1;\n      this.$emit('slide', { index: this.currentIndex });\n    },\n    preload(imageIndex) {\n      return imageIndex === this.currentIndex\n       || imageIndex === this.currentIndex - 1\n       || imageIndex === this.currentIndex + 1;\n    },\n    bindEvents() {\n      document.addEventListener('keydown', this.keyDownHandler, false);\n    },\n    unbindEvents() {\n      document.removeEventListener('keydown', this.keyDownHandler, false);\n    },\n    touchstartHandler(event) {\n      this.touch.count += 1;\n      if (this.touch.count > 1) {\n        this.touch.multitouch = true;\n      }\n      this.touch.x = event.changedTouches[0].pageX;\n      this.touch.y = event.changedTouches[0].pageY;\n    },\n    touchmoveHandler(event) {\n      if (this.touch.flag || this.touch.multitouch) return;\n\n      const touchEvent = event.touches[0] || event.changedTouches[0];\n\n      if (touchEvent.pageX - this.touch.x > 40) {\n        this.touch.flag = true;\n        this.prev();\n      } else if (touchEvent.pageX - this.touch.x < -40) {\n        this.touch.flag = true;\n        this.next();\n      }\n    },\n    touchendHandler() {\n      this.touch.count -= 1;\n      if (this.touch.count <= 0) {\n        this.touch.multitouch = false;\n      }\n      this.touch.flag = false;\n    },\n    keyDownHandler(event) {\n      switch (event.keyCode) {\n        case keyMap.LEFT:\n          this.prev();\n          break;\n        case keyMap.RIGHT:\n          this.next();\n          break;\n        case keyMap.ESC:\n          this.close();\n          break;\n        default:\n          break;\n      }\n    },\n  },\n};\n</script>\n\n<style lang=\"scss\" scoped>\n.light-gallery {\n  &__modal {\n    position: fixed;\n    display: block;\n    z-index: 1001;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n  }\n\n  &__content {\n    height: 100%;\n    width: 100%;\n    white-space: nowrap;\n    padding: 0;\n    margin: 0;\n    overflow: hidden;\n  }\n\n  &__container {\n    position: absolute;\n    display: block;\n    width: 100%;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  }\n\n  &__image {\n    & {\n      display: inline-table;\n      vertical-align: middle;\n      position: relative;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n      transition: left .4s ease, transform .4s ease, -webkit-transform .4s ease;\n    }\n\n    img {\n      display: block;\n      margin: 0 auto;\n      max-width: 100%;\n    }\n  }\n\n  &__next,\n  &__prev,\n  &__close {\n    position: absolute;\n    z-index: 1002;\n    display: block;\n    background: transparent;\n    border: 0;\n    line-height: 0;\n    outline: none;\n    padding: 0;\n    cursor: pointer;\n\n    & svg {\n      width: 44px;\n      height: 60px;\n    }\n  }\n\n  &__next {\n    top: 50%;\n    transform: translate(0, -50%);\n    right: 1.5%;\n    vertical-align: middle;\n  }\n\n  &__prev {\n    top: 50%;\n    transform: translate(0, -50%);\n    left: 1.5%;\n  }\n\n  &__close {\n    & {\n      right: 0;\n      padding: 20px;\n    }\n\n    svg {\n      width: 30px;\n      height: 30px;\n    }\n  }\n}\n.fade-enter-active, .fade-leave-active {\n  position: fixed;\n  z-index: 1000;\n  transition: opacity .2s;\n}\n.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {\n  position: fixed;\n  opacity: 0;\n  z-index: 1000;\n}\n</style>\n",".light-gallery__modal {\n  position: fixed;\n  display: block;\n  z-index: 1001;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden; }\n\n.light-gallery__content {\n  height: 100%;\n  width: 100%;\n  white-space: nowrap;\n  padding: 0;\n  margin: 0;\n  overflow: hidden; }\n\n.light-gallery__container {\n  position: absolute;\n  display: block;\n  width: 100%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%); }\n\n.light-gallery__image {\n  display: inline-table;\n  vertical-align: middle;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: left .4s ease, transform .4s ease, -webkit-transform .4s ease; }\n\n.light-gallery__image img {\n  display: block;\n  margin: 0 auto;\n  max-width: 100%; }\n\n.light-gallery__next, .light-gallery__prev, .light-gallery__close {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  background: transparent;\n  border: 0;\n  line-height: 0;\n  outline: none;\n  padding: 0;\n  cursor: pointer; }\n  .light-gallery__next svg, .light-gallery__prev svg, .light-gallery__close svg {\n    width: 44px;\n    height: 60px; }\n\n.light-gallery__next {\n  top: 50%;\n  transform: translate(0, -50%);\n  right: 1.5%;\n  vertical-align: middle; }\n\n.light-gallery__prev {\n  top: 50%;\n  transform: translate(0, -50%);\n  left: 1.5%; }\n\n.light-gallery__close {\n  right: 0;\n  padding: 20px; }\n\n.light-gallery__close svg {\n  width: 30px;\n  height: 30px; }\n\n.fade-enter-active, .fade-leave-active {\n  position: fixed;\n  z-index: 1000;\n  transition: opacity .2s; }\n\n.fade-enter, .fade-leave-to {\n  position: fixed;\n  opacity: 0;\n  z-index: 1000; }\n\n/*# sourceMappingURL=light-gallery.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-3c8ee6e7";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var LightGallery = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

function install(Vue, options) {
	if ( options === void 0 ) options = {};
	if (install.installed) { return; }
	install.installed = true;
	var componentId = options.componentId; if ( componentId === void 0 ) componentId = 'LightGallery';
	Vue.component(componentId, LightGallery);
}
var wrapper = {
	install: install,
};

export default wrapper;
export { install, LightGallery };
