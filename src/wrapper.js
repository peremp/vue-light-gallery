// Import vue component
import LightGallery from '../src/light-gallery.vue';

// Declare install function executed by Vue.use()
export function install(Vue, options = {}) {
	if (install.installed) return;
	install.installed = true;
	const { componentId = 'LightGallery' } = options;
	Vue.component(componentId, LightGallery);
}

// Module definition for Vue.use()
export default {
	install,
};

// To allow use as module (npm/webpack/etc.) export component
export { LightGallery };
