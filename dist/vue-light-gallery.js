(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VueLightGallery = factory());
}(this, function () { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

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
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


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
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
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
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

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
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(typeof _vm.index === 'number')?_c('div',{staticClass:"light-gallery",on:{"touchstart":_vm.touchstartHandler,"touchmove":_vm.touchmoveHandler,"touchend":_vm.touchendHandler}},[_c('div',{staticClass:"light-gallery__modal",style:(("background: " + _vm.background))},[_c('div',{staticClass:"light-gallery__container"},[_c('ul',{staticClass:"light-gallery__content"},_vm._l((_vm.images),function(image,imageIndex){return _c('li',{key:imageIndex,staticClass:"light-gallery__image",style:(("transform: translate3d(" + (_vm.currentIndex * -100) + "%, 0px, 0px);"))},[(_vm.preload(imageIndex))?_c('img',{attrs:{"src":_vm.images[imageIndex]}}):_vm._e()])}),0)]),_vm._v(" "),(_vm.currentIndex > 0)?_c('button',{staticClass:"light-gallery__prev",style:(("background: " + _vm.background)),on:{"click":function($event){return _vm.prev()}}},[_c('svg',[_c('polyline',{attrs:{"points":"30 10 10 30 30 50","stroke-width":"4","stroke-linecap":"butt","fill":"none","stroke-linejoin":"round","stroke":_vm.interfaceColor}})])]):_vm._e(),_vm._v(" "),(_vm.currentIndex + 1 < _vm.images.length)?_c('button',{staticClass:"light-gallery__next",style:(("background: " + _vm.background)),on:{"click":function($event){return _vm.next()}}},[_c('svg',[_c('polyline',{attrs:{"points":"14 10 34 30 14 50","stroke-width":"4","stroke-linecap":"butt","fill":"none","stroke-linejoin":"round","stroke":_vm.interfaceColor}})])]):_vm._e(),_vm._v(" "),_c('button',{staticClass:"light-gallery__close",style:(("background: " + _vm.background)),on:{"click":function($event){return _vm.close()}}},[_c('svg',{attrs:{"width":"30","height":"30"}},[_c('g',{attrs:{"stroke-width":"4","stroke":_vm.interfaceColor}},[_c('line',{attrs:{"x1":"5","y1":"5","x2":"25","y2":"25"}}),_vm._v(" "),_c('line',{attrs:{"x1":"5","y1":"25","x2":"25","y2":"5"}})])])])])]):_vm._e()])};
  var __vue_staticRenderFns__ = [];

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-0b1c9572_0", { source: ".light-gallery__modal[data-v-0b1c9572]{position:fixed;display:block;z-index:1001;top:0;left:0;width:100%;height:100%;overflow:hidden}.light-gallery__content[data-v-0b1c9572]{height:100%;width:100%;white-space:nowrap;padding:0;margin:0;overflow:hidden}.light-gallery__container[data-v-0b1c9572]{position:absolute;display:block;width:100%;top:50%;left:50%;transform:translate(-50%,-50%)}.light-gallery__image[data-v-0b1c9572]{display:inline-table;vertical-align:middle;position:relative;width:100%;height:100%;text-align:center;transition:left .4s ease,transform .4s ease,-webkit-transform .4s ease}.light-gallery__image img[data-v-0b1c9572]{display:block;margin:0 auto;max-width:100%}.light-gallery__close[data-v-0b1c9572],.light-gallery__next[data-v-0b1c9572],.light-gallery__prev[data-v-0b1c9572]{position:absolute;z-index:1002;display:block;background:0 0;border:0;line-height:0;outline:0;padding:0;cursor:pointer}.light-gallery__close svg[data-v-0b1c9572],.light-gallery__next svg[data-v-0b1c9572],.light-gallery__prev svg[data-v-0b1c9572]{width:44px;height:60px}.light-gallery__next[data-v-0b1c9572]{top:50%;transform:translate(0,-50%);right:1.5%;vertical-align:middle}.light-gallery__prev[data-v-0b1c9572]{top:50%;transform:translate(0,-50%);left:1.5%}.light-gallery__close[data-v-0b1c9572]{right:0;padding:20px}.light-gallery__close svg[data-v-0b1c9572]{width:30px;height:30px}.fade-enter-active[data-v-0b1c9572],.fade-leave-active[data-v-0b1c9572]{position:fixed;z-index:1000;transition:opacity .2s}.fade-enter[data-v-0b1c9572],.fade-leave-to[data-v-0b1c9572]{position:fixed;opacity:0;z-index:1000}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = "data-v-0b1c9572";
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

  return LightGallery;

}));
