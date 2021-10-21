import { defineConfig } from 'vite'
const { resolve } = require('path')
import vue from '@vitejs/plugin-vue'

// const _resolve = (dir) =>  path.resolve(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      //这里是通过请求/api 来转发到 https://api.pingping6.com/
      //假如你要请求https://api.*.com/a/a
      //那么axios的url，可以配置为 /api/a/a
      '/api-user': {
        target: 'http://10.8.10.205:8080',
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
      '@': resolve(__dirname, 'src/'),
      '_c': resolve(__dirname, 'src/components')
    }
  }
})
