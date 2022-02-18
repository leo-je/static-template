<template>
  <div style="padding: 10px;">
    <v-form-render
      :form-json="formJson"
      :form-data="formData"
      :option-data="optionData"
      ref="vFormRef"
    ></v-form-render>
    <div v-if="!isViewer">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/http';
// 获取路由参数
import { useRoute } from 'vue-router'
const route = useRoute()

const formJson = reactive({http, "widgetList": [{ "key": 17471, "type": "grid", "category": "container", "icon": "grid", "cols": [{ "type": "grid-col", "category": "container", "icon": "grid-col", "internal": true, "widgetList": [], "options": { "name": "gridCol25694", "hidden": false, "span": 12, "offset": 0, "push": 0, "pull": 0, "responsive": false, "md": 12, "sm": 12, "xs": 12, "customClass": "" }, "id": "grid-col-25694" }, { "type": "grid-col", "category": "container", "icon": "grid-col", "internal": true, "widgetList": [], "options": { "name": "gridCol41663", "hidden": false, "span": 12, "offset": 0, "push": 0, "pull": 0, "responsive": false, "md": 12, "sm": 12, "xs": 12, "customClass": "" }, "id": "grid-col-41663" }], "options": { "name": "grid55461", "hidden": false, "gutter": 12, "colHeight": null, "customClass": [] }, "id": "grid55461" }], "formConfig": { "modelName": "formData", "refName": "vForm", "rulesName": "rules", "labelWidth": 80, "labelPosition": "left", "size": "", "labelAlign": "label-left-align", "cssCode": "", "customClass": "", "functions": "", "layoutType": "PC", "jsonVersion": 3, "onFormCreated": "", "onFormMounted": "", "onFormDataChange": "", "onFormValidate": "" } })
const formData = reactive({})
const optionData = reactive({})
const vFormRef = ref({http:http})
let formId = ref()
const isViewer = ref(true)

window.http =http

const getFormById = async (formId?: string): Promise<any> => {
  let data = await http('post', '/api-process/process/form/getFormById?id=' + formId);
  return data;
}

const submitForm = () => {

}
onMounted(() => {
  console.log("mounted")
  let query = route.query
  if (query && query.isViewer && query.isViewer == "1") {
    isViewer.value = true
  } else {
    isViewer.value = false
  }
  if (query && query.formId) {
    formId.value = query.formId + ''
    getFormById(formId.value).then(data => {
      if (data) {
        formJson.formConfig = JSON.parse(data.formJson).formConfig;
        formJson.widgetList = JSON.parse(data.formJson).widgetList;
      }
    })

  }
})
</script>