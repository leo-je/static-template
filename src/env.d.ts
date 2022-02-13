/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ant-design/icons-vue';

declare const React: string;
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.bpmn';

