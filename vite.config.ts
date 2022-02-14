import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression';
import { rawTransform } from './viteExtend';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// const _resolve = (dir) =>  path.resolve(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    //声明深度路径模块
    include: [
      'bpmn-js/lib/Modeler',
      'highlight.js',
      'codemirror',
      'codemirror/mode/xml/xml.js',
      'codemirror/addon/hint/xml-hint.js',
      'bpmn-js/lib/features/label-editing/LabelUtil.js',
    ],
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  plugins: [vue(), vueJsx(), rawTransform([/\.bpmn$/]), viteCompression(), AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      //这里是通过请求/api 来转发到 https://api.pingping6.com/
      //假如你要请求https://api.*.com/a/a
      //那么axios的url，可以配置为 /api/a/a
      '/api': {
        target: 'http://192.168.200.242:8080',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },

    }
  },
  build: {
    assetsDir: "static"
  },
  resolve: {
    alias:
      [{
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
      {
        find: '_c',
        replacement: resolve(__dirname, './src/components'),
      },
      ]
  }
})


