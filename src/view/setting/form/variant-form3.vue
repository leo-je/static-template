<template>
    <div class="designer">
        <v-form-designer ref="formDesigner"></v-form-designer>
        <div class="extend-button">
            <div>
                <el-form ref="vForm" label-position="left" label-width="80px" size="default">
                    <el-row>
                        <el-col :span="12" class="grid-cell">
                            <el-form-item label="表单名称" prop="input9923">
                                <el-input v-model="formName" placeholder="输入表单名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="grid-cell">
                            <el-form-item prop="input33502">
                                <el-button type="primary" @click="saveForm">保存</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import http from "@/utils/http";
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";

import 'vform3-builds/dist/designer.style.css'  //引入VForm样式

export default defineComponent({

    setup() {
        return {
            formId: ref<string | null>(''),
            formName: ref<string | null>(''),
            formDesigner: ref(),
            formJson: ref()
        }
    },
    mounted() {
        console.log("mounted")
        this.formDesigner = this.$refs.formDesigner;
        console.log(this.formDesigner)
        this.formDesigner.clearDesigner(true)
        let query = this.$route.query
        if (query && query.formId) {
            this.formId = query.formId + ''
            this.getFormById(this.formId).then(json => {
                if (json) {
                    this.formJson = json.formJson;
                    this.formDesigner.designer.loadFormJson(JSON.parse(json.formJson))
                    this.formName = json.formName
                }
            })

        }
    },
    methods: {
        async getFormById(formId?: string): Promise<any> {
            let formJson = await http('post', '/api-process/process/form/getFormById?id=' + formId);
            return formJson;
        },
        saveForm(a: any) {
            // this.formId = this.formId
            console.log(this.formDesigner)
            this.formJson = this.formDesigner ? this.formDesigner.getFormJson() : null
            console.log(this.formJson)
            let data = {
                formName: this.formName,
                id: this.formId,
                formJson: JSON.stringify(this.formJson),
                type: this.formJson.formConfig.layoutType
            }
            http('post', '/api-process/process/form/saveForm', data).then(formId => {
                this.formId = formId
                ElMessage("保存成功")
            }).catch(e => {
                ElMessage(e)
            })
        }
    }

})


</script>

<style lang="less">
#app .designer .main-container .main-header {
    display: none;
}
</style>

<style lang="less" scoped>
// 原版本信息

.designer {
    position: relative;
}
.designer .extend-button {
    position: absolute;
    bottom: -55px;
    left: 30%;
}
</style>