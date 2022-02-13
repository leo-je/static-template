import { defineConfig } from 'vite'
const { resolve } = require('path')
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression';

// const _resolve = (dir) =>  path.resolve(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  plugins: [vue(), vueJsx(),viteCompression()],
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
  build:{
    assetsDir:"static"
  },
  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src'),
      '_c': resolve(__dirname, 'src/components')
    }
  }
})


