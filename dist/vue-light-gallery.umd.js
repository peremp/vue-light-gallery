(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueLightGallery = {}));
})(this, (function (exports) { 'use strict';

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
      closeOnTap: {
        type: Boolean,
        default: true
      }
    },
    data: function data() {
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
      formattedImages: function formattedImages() {
        return this.images.map(function (image) { return (typeof image === 'string'
          ? { url: image } : image
        ); });
      },
    },
    watch: {
      index: function index(val) {
        if (!document) { return; }
        this.currentIndex = val;
        if (this.disableScroll && typeof val === 'number') {
          document.body.style.overflow = 'hidden';
        } else if (this.disableScroll && !val) {
          document.body.style.overflow = this.bodyOverflowStyle;
        }
      },
      currentIndex: function currentIndex(val) {
        this.setImageLoaded(val);
      },
    },
    mounted: function mounted() {
      if (!document) { return; }
      this.bodyOverflowStyle = document.body.style.overflow;
      this.bindEvents();
    },
    beforeDestroy: function beforeDestroy() {
      if (!document) { return; }
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
      imageLoaded: function imageLoaded($event, imageIndex) {
        var target = $event.target;
        target.classList.add('loaded');
        if (imageIndex === this.currentIndex) {
          this.setImageLoaded(imageIndex);
        }
      },
      getImageElByIndex: function getImageElByIndex(index) {
        var elements = this.$refs[("lg-img-" + index)] || [];
        return elements[0];
      },
      setImageLoaded: function setImageLoaded(index) {
        var el = this.getImageElByIndex(index);
        this.isImageLoaded = !el ? false : el.classList.contains('loaded');
      },
      shouldPreload: function shouldPreload(index) {
        var el = this.getImageElByIndex(index) || {};
        var src = el.src;
        return !!src
         || index === this.currentIndex
         || index === this.currentIndex - 1
         || index === this.currentIndex + 1;
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
        }
      },
    },
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
          hook = function (context) {
              context =
                  context ||
                      (this.$vnode && this.$vnode.ssrContext) ||
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext);
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
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
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
          }
          else {
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {
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
                touchend: _vm.touchendHandler,
              },
            },
            [
              _c(
                "div",
                {
                  staticClass: "light-gallery__modal",
                  style: "background: " + _vm.background,
                },
                [
                  _c(
                    "div",
                    {
                      class: [
                        "light-gallery__spinner",
                        !_vm.isImageLoaded || "hide" ],
                    },
                    [
                      _c("div", {
                        staticClass: "light-gallery__dot",
                        style: "border-color: " + _vm.interfaceColor,
                      }),
                      _vm._v(" "),
                      _c("div", {
                        staticClass: "light-gallery__dot",
                        style: "border-color: " + _vm.interfaceColor,
                      }),
                      _vm._v(" "),
                      _c("div", {
                        staticClass: "light-gallery__dot",
                        style: "border-color: " + _vm.interfaceColor,
                      }) ]
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "light-gallery__container" }, [
                    _c(
                      "ul",
                      { staticClass: "light-gallery__content" },
                      _vm._l(_vm.formattedImages, function (image, imageIndex) {
                        return _c(
                          "li",
                          {
                            key: imageIndex,
                            staticClass: "light-gallery__image-container",
                            style:
                              "transform: translate3d(" +
                              _vm.currentIndex * -100 +
                              "%, 0px, 0px);",
                            on: {
                              click: function ($event) {
                                _vm.closeOnTap && _vm.close();
                              },
                            },
                          },
                          [
                            _c(
                              "div",
                              {
                                staticClass: "light-gallery__image",
                                on: {
                                  click: function ($event) {
                                    $event.stopPropagation();
                                  },
                                },
                              },
                              [
                                _c(
                                  "div",
                                  {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: image.title && _vm.isImageLoaded,
                                        expression:
                                          "image.title && isImageLoaded",
                                      } ],
                                    staticClass: "light-gallery__text",
                                    style:
                                      "background: " +
                                      _vm.background +
                                      "; color: " +
                                      _vm.interfaceColor,
                                  },
                                  [
                                    _vm._v(
                                      "\n                " +
                                        _vm._s(image.title) +
                                        "\n              "
                                    ) ]
                                ),
                                _vm._v(" "),
                                _c("img", {
                                  ref: "lg-img-" + imageIndex,
                                  refInFor: true,
                                  attrs: {
                                    src: _vm.shouldPreload(imageIndex)
                                      ? image.url
                                      : false,
                                  },
                                  on: {
                                    load: function ($event) {
                                      return _vm.imageLoaded($event, imageIndex)
                                    },
                                  },
                                }) ]
                            ) ]
                        )
                      }),
                      0
                    ) ]),
                  _vm._v(" "),
                  _vm.currentIndex > 0
                    ? _c(
                        "button",
                        {
                          staticClass: "light-gallery__prev",
                          style: "background: " + _vm.background,
                          on: {
                            click: function ($event) {
                              $event.stopPropagation();
                              return _vm.prev()
                            },
                          },
                        },
                        [
                          _c(
                            "svg",
                            {
                              attrs: {
                                width: "25",
                                height: "40",
                                viewBox: "0 0 25 40",
                              },
                            },
                            [
                              _c("polyline", {
                                attrs: {
                                  points: "19 5 5 20 19 35",
                                  "stroke-width": "3",
                                  "stroke-linecap": "butt",
                                  fill: "none",
                                  "stroke-linejoin": "round",
                                  stroke: _vm.interfaceColor,
                                },
                              }) ]
                          ) ]
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
                            click: function ($event) {
                              $event.stopPropagation();
                              return _vm.next()
                            },
                          },
                        },
                        [
                          _c(
                            "svg",
                            {
                              attrs: {
                                width: "25",
                                height: "40",
                                viewBox: "0 0 25 40",
                              },
                            },
                            [
                              _c("polyline", {
                                attrs: {
                                  points: "6 5 20 20 6 35",
                                  "stroke-width": "3",
                                  "stroke-linecap": "butt",
                                  fill: "none",
                                  "stroke-linejoin": "round",
                                  stroke: _vm.interfaceColor,
                                },
                              }) ]
                          ) ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "light-gallery__close",
                      style: "background: " + _vm.background,
                      on: {
                        click: function ($event) {
                          return _vm.close()
                        },
                      },
                    },
                    [
                      _c("svg", { attrs: { width: "30", height: "30" } }, [
                        _c(
                          "g",
                          {
                            attrs: {
                              "stroke-width": "3",
                              stroke: _vm.interfaceColor,
                            },
                          },
                          [
                            _c("line", {
                              attrs: { x1: "5", y1: "5", x2: "25", y2: "25" },
                            }),
                            _vm._v(" "),
                            _c("line", {
                              attrs: { x1: "5", y1: "25", x2: "25", y2: "5" },
                            }) ]
                        ) ]) ]
                  ) ]
              ) ]
          )
        : _vm._e() ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-0aad611d_0", { source: ".light-gallery__modal[data-v-0aad611d] {\n  position: fixed;\n  display: block;\n  z-index: 1001;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.light-gallery__content[data-v-0aad611d] {\n  height: 100%;\n  width: 100%;\n  white-space: nowrap;\n  padding: 0;\n  margin: 0;\n}\n.light-gallery__container[data-v-0aad611d] {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  width: 100%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n}\n.light-gallery__image-container[data-v-0aad611d] {\n  display: inline-table;\n  vertical-align: middle;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: left 0.4s ease, transform 0.4s ease, -webkit-transform 0.4s ease;\n}\n.light-gallery__image[data-v-0aad611d] {\n  display: inline-block;\n  position: relative;\n  margin: 0 auto;\n  max-width: 100%;\n  max-height: 100vh;\n}\n.light-gallery__image img[data-v-0aad611d] {\n  max-width: 100%;\n  max-height: 100vh;\n  opacity: 0;\n  transition: opacity 0.2s;\n}\n.light-gallery__image img.loaded[data-v-0aad611d] {\n  opacity: 1;\n}\n.light-gallery__text[data-v-0aad611d] {\n  position: absolute;\n  z-index: 1000;\n  bottom: 0;\n  display: block;\n  margin: 0 auto;\n  padding: 12px 30px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.light-gallery__next[data-v-0aad611d], .light-gallery__prev[data-v-0aad611d], .light-gallery__close[data-v-0aad611d] {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  background: transparent;\n  border: 0;\n  line-height: 0;\n  outline: none;\n  padding: 7px;\n  cursor: pointer;\n}\n.light-gallery__next[data-v-0aad611d] {\n  top: 50%;\n  transform: translate(0, -50%);\n  right: 1.5%;\n  vertical-align: middle;\n}\n.light-gallery__prev[data-v-0aad611d] {\n  top: 50%;\n  transform: translate(0, -50%);\n  left: 1.5%;\n}\n.light-gallery__close[data-v-0aad611d] {\n  right: 0;\n  padding: 12px;\n}\n.light-gallery__spinner[data-v-0aad611d] {\n  position: absolute;\n  z-index: 1003;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  margin: 0 auto;\n  display: block;\n  height: 15px;\n  width: auto;\n  box-sizing: border-box;\n  text-align: center;\n}\n.light-gallery__spinner.hide[data-v-0aad611d] {\n  display: none;\n}\n.light-gallery__dot[data-v-0aad611d] {\n  float: left;\n  margin: 0 7.5px;\n  width: 15px;\n  height: 15px;\n  border: 3px solid rgba(255, 255, 255, 0.8);\n  border-radius: 50%;\n  transform: scale(0);\n  box-sizing: border-box;\n  animation: spinner-animation-data-v-0aad611d 1000ms ease infinite 0ms;\n}\n.light-gallery__dot[data-v-0aad611d]:nth-child(1) {\n  animation-delay: 300ms;\n}\n.light-gallery__dot[data-v-0aad611d]:nth-child(2) {\n  animation-delay: 600ms;\n}\n.light-gallery__dot[data-v-0aad611d]:nth-child(3) {\n  animation-delay: 900ms;\n}\n.fade-enter-active[data-v-0aad611d], .fade-leave-active[data-v-0aad611d] {\n  position: fixed;\n  z-index: 1000;\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-0aad611d], .fade-leave-to[data-v-0aad611d] {\n  position: fixed;\n  opacity: 0;\n  z-index: 1000;\n}\n@keyframes spinner-animation-data-v-0aad611d {\n50% {\n    transform: scale(1);\n    opacity: 1;\n}\n100% {\n    opacity: 0;\n}\n}\n\n/*# sourceMappingURL=light-gallery.vue.map */", map: {"version":3,"sources":["C:\\xampp\\htdocs\\k-john-vue-light-gallery\\src\\light-gallery.vue","light-gallery.vue"],"names":[],"mappings":"AAsTA;EACA,eAAA;EACA,cAAA;EACA,aAAA;EACA,MAAA;EACA,OAAA;EACA,WAAA;EACA,YAAA;EACA,gBAAA;ACrTA;ADwTA;EACA,YAAA;EACA,WAAA;EACA,mBAAA;EACA,UAAA;EACA,SAAA;ACtTA;ADyTA;EACA,kBAAA;EACA,aAAA;EACA,cAAA;EACA,WAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;EACA,kBAAA;ACvTA;AD0TA;EACA,qBAAA;EACA,sBAAA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,kBAAA;EACA,4EAAA;ACxTA;AD4TA;EACA,qBAAA;EACA,kBAAA;EACA,cAAA;EACA,eAAA;EACA,iBAAA;AC1TA;AD+TA;EACA,eAAA;EACA,iBAAA;EACA,UAAA;EACA,wBAAA;AC7TA;ADgUA;EACA,UAAA;AC9TA;ADoUA;EACA,kBAAA;EACA,aAAA;EACA,SAAA;EACA,cAAA;EACA,cAAA;EACA,kBAAA;EACA,WAAA;EACA,sBAAA;AClUA;ADqUA;EAGA,kBAAA;EACA,aAAA;EACA,cAAA;EACA,uBAAA;EACA,SAAA;EACA,cAAA;EACA,aAAA;EACA,YAAA;EACA,eAAA;ACrUA;ADwUA;EACA,QAAA;EACA,6BAAA;EACA,WAAA;EACA,sBAAA;ACtUA;ADyUA;EACA,QAAA;EACA,6BAAA;EACA,UAAA;ACvUA;AD0UA;EACA,QAAA;EACA,aAAA;ACxUA;AD4UA;EACA,kBAAA;EACA,aAAA;EACA,QAAA;EACA,SAAA;EACA,gCAAA;EACA,cAAA;EACA,cAAA;EACA,YAAA;EACA,WAAA;EACA,sBAAA;EACA,kBAAA;AC1UA;AD6UA;EACA,aAAA;AC3UA;ADgVA;EACA,WAAA;EACA,eAAA;EACA,WAAA;EACA,YAAA;EACA,0CAAA;EACA,kBAAA;EACA,mBAAA;EACA,sBAAA;EACA,qEAAA;AC9UA;ADiVA;EACA,sBAAA;AC/UA;ADkVA;EACA,sBAAA;AChVA;ADmVA;EACA,sBAAA;ACjVA;ADsVA;EACA,eAAA;EACA,aAAA;EACA,wBAAA;ACnVA;ADsVA;EACA,eAAA;EACA,UAAA;EACA,aAAA;ACnVA;ADsVA;AACA;IACA,mBAAA;IACA,UAAA;ACnVE;ADqVF;IACA,UAAA;ACnVE;AACF;;AAEA,4CAA4C","file":"light-gallery.vue","sourcesContent":["<template>\r\n  <transition name=\"fade\">\r\n    <div\r\n      v-if=\"typeof index === 'number'\"\r\n      class=\"light-gallery\"\r\n      @touchstart=\"touchstartHandler\"\r\n      @touchmove=\"touchmoveHandler\"\r\n      @touchend=\"touchendHandler\"\r\n    >\r\n      <div\r\n        class=\"light-gallery__modal\"\r\n        :style=\"`background: ${background}`\"\r\n      >\r\n        <div\r\n          :class=\"['light-gallery__spinner', !isImageLoaded || 'hide']\"\r\n        >\r\n          <div\r\n            class=\"light-gallery__dot\"\r\n            :style=\"`border-color: ${interfaceColor}`\"\r\n          />\r\n          <div\r\n            class=\"light-gallery__dot\"\r\n            :style=\"`border-color: ${interfaceColor}`\"\r\n          />\r\n          <div\r\n            class=\"light-gallery__dot\"\r\n            :style=\"`border-color: ${interfaceColor}`\"\r\n          />\r\n        </div>\r\n        <div class=\"light-gallery__container\">\r\n          <ul class=\"light-gallery__content\">\r\n            <li\r\n              v-for=\"(image, imageIndex) in formattedImages\"\r\n              :key=\"imageIndex\"\r\n              :style=\"`transform: translate3d(${currentIndex * -100}%, 0px, 0px);`\"\r\n              class=\"light-gallery__image-container\"\r\n              @click=\"closeOnTap && close()\"\r\n            >\r\n              <div class=\"light-gallery__image\"\r\n                @click.stop=\"\">\r\n                <div\r\n                  v-show=\"image.title && isImageLoaded\"\r\n                  class=\"light-gallery__text\"\r\n                  :style=\"`background: ${background}; color: ${interfaceColor}`\"\r\n                >\r\n                  {{ image.title }}\r\n                </div>\r\n                <img\r\n                  :ref=\"`lg-img-${imageIndex}`\"\r\n                  :src=\"shouldPreload(imageIndex) ? image.url : false\"\r\n                  @load=\"imageLoaded($event, imageIndex)\"\r\n                >\r\n              </div>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n        <button\r\n          v-if=\"currentIndex > 0\"\r\n          class=\"light-gallery__prev\"\r\n          :style=\"`background: ${background}`\"\r\n          @click.stop=\"prev()\"\r\n        >\r\n          <svg\r\n            width=\"25\"\r\n            height=\"40\"\r\n            viewBox=\"0 0 25 40\"\r\n          >\r\n            <polyline\r\n              points=\"19 5 5 20 19 35\"\r\n              stroke-width=\"3\"\r\n              stroke-linecap=\"butt\"\r\n              fill=\"none\"\r\n              stroke-linejoin=\"round\"\r\n              :stroke=\"interfaceColor\"\r\n            />\r\n          </svg>\r\n        </button>\r\n        <button\r\n          v-if=\"currentIndex + 1 < images.length\"\r\n          class=\"light-gallery__next\"\r\n          :style=\"`background: ${background}`\"\r\n          @click.stop=\"next()\"\r\n        >\r\n          <svg\r\n            width=\"25\"\r\n            height=\"40\"\r\n            viewBox=\"0 0 25 40\"\r\n          >\r\n            <polyline\r\n              points=\"6 5 20 20 6 35\"\r\n              stroke-width=\"3\"\r\n              stroke-linecap=\"butt\"\r\n              fill=\"none\"\r\n              stroke-linejoin=\"round\"\r\n              :stroke=\"interfaceColor\"\r\n            />\r\n          </svg>\r\n        </button>\r\n        <button\r\n          class=\"light-gallery__close\"\r\n          :style=\"`background: ${background}`\"\r\n          @click=\"close()\"\r\n        >\r\n          <svg\r\n            width=\"30\"\r\n            height=\"30\"\r\n          >\r\n            <g\r\n              stroke-width=\"3\"\r\n              :stroke=\"interfaceColor\"\r\n            >\r\n              <line\r\n                x1=\"5\"\r\n                y1=\"5\"\r\n                x2=\"25\"\r\n                y2=\"25\"\r\n              />\r\n              <line\r\n                x1=\"5\"\r\n                y1=\"25\"\r\n                x2=\"25\"\r\n                y2=\"5\"\r\n              />\r\n            </g>\r\n          </svg>\r\n        </button>\r\n      </div>\r\n    </div>\r\n  </transition>\r\n</template>\r\n\r\n<script>\r\nconst keyMap = {\r\n  LEFT: 37,\r\n  RIGHT: 39,\r\n  ESC: 27,\r\n};\r\n\r\nexport default {\r\n  props: {\r\n    images: {\r\n      type: Array,\r\n      default: () => [],\r\n    },\r\n    index: {\r\n      type: Number,\r\n      default: 1,\r\n    },\r\n    disableScroll: {\r\n      type: Boolean,\r\n      default: false,\r\n    },\r\n    background: {\r\n      type: String,\r\n      default: 'rgba(0, 0, 0, 0.8)',\r\n    },\r\n    interfaceColor: {\r\n      type: String,\r\n      default: 'rgba(255, 255, 255, 0.8)',\r\n    },\r\n    closeOnTap: {\r\n      type: Boolean,\r\n      default: true\r\n    }\r\n  },\r\n  data() {\r\n    return {\r\n      currentIndex: this.index,\r\n      isImageLoaded: false,\r\n      bodyOverflowStyle: '',\r\n      touch: {\r\n        count: 0,\r\n        x: 0,\r\n        y: 0,\r\n        multitouch: false,\r\n        flag: false,\r\n      },\r\n    };\r\n  },\r\n  computed: {\r\n    formattedImages() {\r\n      return this.images.map(image => (typeof image === 'string'\r\n        ? { url: image } : image\r\n      ));\r\n    },\r\n  },\r\n  watch: {\r\n    index(val) {\r\n      if (!document) return;\r\n\r\n      this.currentIndex = val;\r\n\r\n      if (this.disableScroll && typeof val === 'number') {\r\n        document.body.style.overflow = 'hidden';\r\n      } else if (this.disableScroll && !val) {\r\n        document.body.style.overflow = this.bodyOverflowStyle;\r\n      }\r\n    },\r\n    currentIndex(val) {\r\n      this.setImageLoaded(val);\r\n    },\r\n  },\r\n  mounted() {\r\n    if (!document) return;\r\n\r\n    this.bodyOverflowStyle = document.body.style.overflow;\r\n    this.bindEvents();\r\n  },\r\n  beforeDestroy() {\r\n    if (!document) return;\r\n\r\n    if (this.disableScroll) {\r\n      document.body.style.overflow = this.bodyOverflowStyle;\r\n    }\r\n    this.unbindEvents();\r\n  },\r\n  methods: {\r\n    close() {\r\n      this.$emit('close');\r\n    },\r\n    prev() {\r\n      if (this.currentIndex === 0) return;\r\n      this.currentIndex -= 1;\r\n      this.$emit('slide', { index: this.currentIndex });\r\n    },\r\n    next() {\r\n      if (this.currentIndex === this.images.length - 1) return;\r\n      this.currentIndex += 1;\r\n      this.$emit('slide', { index: this.currentIndex });\r\n    },\r\n    imageLoaded($event, imageIndex) {\r\n      const { target } = $event;\r\n      target.classList.add('loaded');\r\n\r\n      if (imageIndex === this.currentIndex) {\r\n        this.setImageLoaded(imageIndex);\r\n      }\r\n    },\r\n    getImageElByIndex(index) {\r\n      const elements = this.$refs[`lg-img-${index}`] || [];\r\n      return elements[0];\r\n    },\r\n    setImageLoaded(index) {\r\n      const el = this.getImageElByIndex(index);\r\n      this.isImageLoaded = !el ? false : el.classList.contains('loaded');\r\n    },\r\n    shouldPreload(index) {\r\n      const el = this.getImageElByIndex(index) || {};\r\n      const { src } = el;\r\n\r\n      return !!src\r\n       || index === this.currentIndex\r\n       || index === this.currentIndex - 1\r\n       || index === this.currentIndex + 1;\r\n    },\r\n    bindEvents() {\r\n      document.addEventListener('keydown', this.keyDownHandler, false);\r\n    },\r\n    unbindEvents() {\r\n      document.removeEventListener('keydown', this.keyDownHandler, false);\r\n    },\r\n    touchstartHandler(event) {\r\n      this.touch.count += 1;\r\n      if (this.touch.count > 1) {\r\n        this.touch.multitouch = true;\r\n      }\r\n      this.touch.x = event.changedTouches[0].pageX;\r\n      this.touch.y = event.changedTouches[0].pageY;\r\n    },\r\n    touchmoveHandler(event) {\r\n      if (this.touch.flag || this.touch.multitouch) return;\r\n\r\n      const touchEvent = event.touches[0] || event.changedTouches[0];\r\n\r\n      if (touchEvent.pageX - this.touch.x > 40) {\r\n        this.touch.flag = true;\r\n        this.prev();\r\n      } else if (touchEvent.pageX - this.touch.x < -40) {\r\n        this.touch.flag = true;\r\n        this.next();\r\n      }\r\n    },\r\n    touchendHandler() {\r\n      this.touch.count -= 1;\r\n      if (this.touch.count <= 0) {\r\n        this.touch.multitouch = false;\r\n      }\r\n      this.touch.flag = false;\r\n    },\r\n    keyDownHandler(event) {\r\n      switch (event.keyCode) {\r\n        case keyMap.LEFT:\r\n          this.prev();\r\n          break;\r\n        case keyMap.RIGHT:\r\n          this.next();\r\n          break;\r\n        case keyMap.ESC:\r\n          this.close();\r\n          break;\r\n        default:\r\n          break;\r\n      }\r\n    },\r\n  },\r\n};\r\n</script>\r\n\r\n<style lang=\"scss\" scoped>\r\n.light-gallery {\r\n  &__modal {\r\n    position: fixed;\r\n    display: block;\r\n    z-index: 1001;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow: hidden;\r\n  }\r\n\r\n  &__content {\r\n    height: 100%;\r\n    width: 100%;\r\n    white-space: nowrap;\r\n    padding: 0;\r\n    margin: 0;\r\n  }\r\n\r\n  &__container {\r\n    position: absolute;\r\n    z-index: 1002;\r\n    display: block;\r\n    width: 100%;\r\n    top: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n    text-align: center;\r\n  }\r\n\r\n  &__image-container {\r\n    display: inline-table;\r\n    vertical-align: middle;\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n    text-align: center;\r\n    transition: left .4s ease, transform .4s ease, -webkit-transform .4s ease;\r\n  }\r\n\r\n  &__image {\r\n    & {\r\n      display: inline-block;\r\n      position: relative;\r\n      margin: 0 auto;\r\n      max-width: 100%;\r\n      max-height: 100vh;\r\n      // opacity: 0;\r\n    }\r\n\r\n    & img {\r\n      & {\r\n        max-width: 100%;\r\n        max-height: 100vh;\r\n        opacity: 0;\r\n        transition: opacity .2s;\r\n      }\r\n\r\n      &.loaded{\r\n        opacity: 1;\r\n      }\r\n    }\r\n\r\n  }\r\n\r\n  &__text {\r\n    position: absolute;\r\n    z-index: 1000;\r\n    bottom: 0;\r\n    display: block;\r\n    margin: 0 auto;\r\n    padding: 12px 30px;\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n  }\r\n\r\n  &__next,\r\n  &__prev,\r\n  &__close {\r\n    position: absolute;\r\n    z-index: 1002;\r\n    display: block;\r\n    background: transparent;\r\n    border: 0;\r\n    line-height: 0;\r\n    outline: none;\r\n    padding: 7px;\r\n    cursor: pointer;\r\n  }\r\n\r\n  &__next {\r\n    top: 50%;\r\n    transform: translate(0, -50%);\r\n    right: 1.5%;\r\n    vertical-align: middle;\r\n  }\r\n\r\n  &__prev {\r\n    top: 50%;\r\n    transform: translate(0, -50%);\r\n    left: 1.5%;\r\n  }\r\n\r\n  &__close {\r\n    right: 0;\r\n    padding: 12px;\r\n  }\r\n\r\n  &__spinner {\r\n    & {\r\n      position: absolute;\r\n      z-index: 1003;\r\n      top: 50%;\r\n      left: 50%;\r\n      transform: translate(-50%, -50%);\r\n      margin: 0 auto;\r\n      display: block;\r\n      height: 15px;\r\n      width: auto;\r\n      box-sizing: border-box;\r\n      text-align: center;\r\n    }\r\n\r\n    &.hide {\r\n      display: none;\r\n    }\r\n  }\r\n\r\n  &__dot {\r\n    & {\r\n      float: left;\r\n      margin: 0 calc(15px / 2);\r\n      width: 15px;\r\n      height: 15px;\r\n      border: calc(15px / 5) solid rgba(255, 255, 255, 0.8);\r\n      border-radius: 50%;\r\n      transform: scale(0);\r\n      box-sizing: border-box;\r\n      animation: spinner-animation 1000ms ease infinite 0ms;\r\n    }\r\n\r\n    &:nth-child(1) {\r\n      animation-delay: calc(300ms * 1);\r\n    }\r\n\r\n    &:nth-child(2) {\r\n      animation-delay: calc(300ms * 2);\r\n    }\r\n\r\n    &:nth-child(3) {\r\n      animation-delay: calc(300ms * 3);\r\n    }\r\n  }\r\n}\r\n\r\n.fade-enter-active, .fade-leave-active {\r\n  position: fixed;\r\n  z-index: 1000;\r\n  transition: opacity .2s;\r\n}\r\n\r\n.fade-enter, .fade-leave-to {\r\n  position: fixed;\r\n  opacity: 0;\r\n  z-index: 1000;\r\n}\r\n\r\n@keyframes spinner-animation {\r\n  50% {\r\n    transform: scale(1);\r\n    opacity: 1;\r\n  }\r\n  100% {\r\n    opacity: 0;\r\n  }\r\n}\r\n</style>\r\n",".light-gallery__modal {\n  position: fixed;\n  display: block;\n  z-index: 1001;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n.light-gallery__content {\n  height: 100%;\n  width: 100%;\n  white-space: nowrap;\n  padding: 0;\n  margin: 0;\n}\n.light-gallery__container {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  width: 100%;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  text-align: center;\n}\n.light-gallery__image-container {\n  display: inline-table;\n  vertical-align: middle;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  transition: left 0.4s ease, transform 0.4s ease, -webkit-transform 0.4s ease;\n}\n.light-gallery__image {\n  display: inline-block;\n  position: relative;\n  margin: 0 auto;\n  max-width: 100%;\n  max-height: 100vh;\n}\n.light-gallery__image img {\n  max-width: 100%;\n  max-height: 100vh;\n  opacity: 0;\n  transition: opacity 0.2s;\n}\n.light-gallery__image img.loaded {\n  opacity: 1;\n}\n.light-gallery__text {\n  position: absolute;\n  z-index: 1000;\n  bottom: 0;\n  display: block;\n  margin: 0 auto;\n  padding: 12px 30px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.light-gallery__next, .light-gallery__prev, .light-gallery__close {\n  position: absolute;\n  z-index: 1002;\n  display: block;\n  background: transparent;\n  border: 0;\n  line-height: 0;\n  outline: none;\n  padding: 7px;\n  cursor: pointer;\n}\n.light-gallery__next {\n  top: 50%;\n  transform: translate(0, -50%);\n  right: 1.5%;\n  vertical-align: middle;\n}\n.light-gallery__prev {\n  top: 50%;\n  transform: translate(0, -50%);\n  left: 1.5%;\n}\n.light-gallery__close {\n  right: 0;\n  padding: 12px;\n}\n.light-gallery__spinner {\n  position: absolute;\n  z-index: 1003;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  margin: 0 auto;\n  display: block;\n  height: 15px;\n  width: auto;\n  box-sizing: border-box;\n  text-align: center;\n}\n.light-gallery__spinner.hide {\n  display: none;\n}\n.light-gallery__dot {\n  float: left;\n  margin: 0 7.5px;\n  width: 15px;\n  height: 15px;\n  border: 3px solid rgba(255, 255, 255, 0.8);\n  border-radius: 50%;\n  transform: scale(0);\n  box-sizing: border-box;\n  animation: spinner-animation 1000ms ease infinite 0ms;\n}\n.light-gallery__dot:nth-child(1) {\n  animation-delay: 300ms;\n}\n.light-gallery__dot:nth-child(2) {\n  animation-delay: 600ms;\n}\n.light-gallery__dot:nth-child(3) {\n  animation-delay: 900ms;\n}\n\n.fade-enter-active, .fade-leave-active {\n  position: fixed;\n  z-index: 1000;\n  transition: opacity 0.2s;\n}\n\n.fade-enter, .fade-leave-to {\n  position: fixed;\n  opacity: 0;\n  z-index: 1000;\n}\n\n@keyframes spinner-animation {\n  50% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n\n/*# sourceMappingURL=light-gallery.vue.map */"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-0aad611d";
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  function install(Vue, options) {
  	if ( options === void 0 ) options = {};
  	if (install.installed) { return; }
  	install.installed = true;
  	var componentId = options.componentId; if ( componentId === void 0 ) componentId = 'LightGallery';
  	Vue.component(componentId, __vue_component__);
  }
  var wrapper = {
  	install: install,
  };

  exports.LightGallery = __vue_component__;
  exports["default"] = wrapper;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
