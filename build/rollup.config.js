import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

const isMinify = process.env.BUILD_MODE === 'minify';

export default {
    input: 'src/wrapper.js',
    output: {
        name: 'VueLightGallery',
        exports: 'named',
    },
    plugins: [
        commonjs(),
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble(),
        cleanup(),
        (isMinify && terser()),
    ],
};
