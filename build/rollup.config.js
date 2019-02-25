import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

const isMinify = process.env.BUILD_MODE === 'minify';

export default {
    input: 'src/wrapper.js',
    output: {
        name: 'VueLightGallery',
        format: 'umd',
        file: isMinify ? 'dist/vue-light-gallery.min.js' : 'dist/vue-light-gallery.js',
    },
    plugins: [
        commonjs(),
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble(),
        (isMinify && terser())
    ],
};
