import { defineComponent, ref, nextTick } from 'vue';
import ButtonRender, { ButtonRenderProps } from '../../../bpmn/components/button-render';
import { BpmnStore } from '../../store';
import CodeMirror from 'codemirror';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import './bpmn-actions.css';

export default defineComponent({
  props: {
    saveHandle: Function,
    isUpdate: Boolean,
  },
  name: 'BpmnActions',
  setup() {
    //放大缩小
    const zoom = ref(1);
    //预览xml的抽屉控制器
    const previewActive = ref(false);
    //取到的xml
    const xml = ref('');

    return {
      zoom,
      previewActive,
      xml,
    };
  },
  render() {
    let _this = this;
    const bpmnContext = BpmnStore;
    //codemirror编辑器
    let coder: CodeMirror.EditorFromTextArea;

    const importFile = function (event: Event) {
      const eventTarget = event.target as HTMLInputElement;
      if (eventTarget.files) {
        const file = eventTarget.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          if (this.result) {
            bpmnContext.importXML(this.result as string);
          }
        };
      }
    };
    const buttonRenderProps: ButtonRenderProps = {
      buttons: [
        { 
          label: '导入',
          icon: 'icon-zu1359',
          action: () => {
            document.getElementById('bpmn-upload-element')?.click();
          },
        },

        {
          label: '保存',
          icon: 'icon-shangchuan',
          action: () => {
            if (this.$props.saveHandle) {
              this.$props.saveHandle()
            }
            // const rootElement: ModdleElement = bpmnContext
            //   .getModeler()
            //   .get('canvas')
            //   .getRootElement();
            // bpmnContext
            //   .getXML()
            //   .then((response: { xml: string }) => {
            //     download(response.xml, rootElement.id || 'process', 'bpmn');
            //   })
            //   .catch((err: unknown) => {
            //     console.warn(err);
            //   });
          },
        },
        {
          label: '放大',
          icon: 'icon-fangda',
          action: () => {
            this.zoom = Math.floor(this.zoom * 100 + 0.1 * 100) / 100;
            bpmnContext.getModeler().get('canvas').zoom(this.zoom);
          },
        },
        {
          label: '缩小',
          icon: 'icon-suoxiao',
          action: () => {
            this.zoom = Math.floor(this.zoom * 100 - 0.1 * 100) / 100;
            bpmnContext.getModeler().get('canvas').zoom(this.zoom);
          },
        },
        {
          label: '还原并居中',
          icon: 'icon-quxiaoquanping',
          action: () => {
            this.zoom = 1;
            bpmnContext.getModeler().get('canvas').zoom('fit-viewport', 'auto');
          },
        },
      ],
    };

    buttonRenderProps.buttons = buttonRenderProps.buttons.filter(button=>{
      if(this.$props.isUpdate){
        if(button.label === '导入'){
          return false;
        }
      }
      return true;
    })

    return (
      <div class="bpmn-actions">
        <ButtonRender {...buttonRenderProps} />
        <el-drawer size="35%" direction="ltr" withHeader={false} v-model={this.previewActive}>
          <textarea id="xml-highlight-container" v-model={this.xml} />
        </el-drawer>
        <input
          type="file"
          id="bpmn-upload-element"
          ref="refFile"
          style="display: none"
          accept=".xml, .bpmn"
          onChange={importFile}
        />
      </div>
    );
  },
});

//文本下载
const download = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data]);
  const tempLink = document.createElement('a'); // 创建a标签
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  //filename
  const fileName = `${filename}.${type}`;
  tempLink.href = href;
  tempLink.target = '_blank';
  tempLink.download = fileName;
  document.body.appendChild(tempLink);
  tempLink.click(); // 点击下载
  document.body.removeChild(tempLink); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};
