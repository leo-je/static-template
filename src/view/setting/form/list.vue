<template>
    <section>
        <div class="add-button">
            <a-config-provider :auto-insert-space-in-button="false">
                <a-button type="primary" @click="addProjet">添加</a-button>
            </a-config-provider>
        </div>
        <a-table :columns="columns" :data-source="data" bordered rowKey="id">
            <template #name="{ text }">
                <a>{{ text }}</a>
            </template>

            <template #status="{ text }">
                <a>{{ text == "1" ? "启用" : "关闭" }}</a>
            </template>

            <template #action="{ text: record }">
                <span>
                    <a-divider type="vertical" />
                    <a class="onSelect" @click="viewer(record)">预览</a>
                    <a-divider type="vertical" />
                    <a class="onSelect" @click="editProject(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a class="onSelect" @click="deleteProject(record.id)">删除</a>
                </span>
            </template>
            <!-- <template #title="">
      Header
            </template>-->

            <!-- <template #footer="">
      Footer
            </template>-->
        </a-table>
    </section>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Button, ConfigProvider, Table, Form, Modal, Switch, FormItem, Divider, Input } from 'ant-design-vue';
import http from "@/utils/http";

// 表头配置
const columns = [
    {
        title: "名称",
        dataIndex: "formName",
        slots: { customRender: "formName" },
    },
    {
        title: "",
        //className: "column-projetInfo",
        dataIndex: "type",
        // slots: { customRender: "type" },
    },
    //   {
    //     title: "Address",
    //     dataIndex: "address",
    //   },
    {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
    },
];
export default defineComponent({
    components: {
        AButton: Button,
        AConfigProvider: ConfigProvider,
        ATable: Table,
        AForm: Form,
        AModal: Modal,
        ASwitch: Switch,
        AFormItem: FormItem,
        ADivider: Divider,
        AInput: Input
    },
    setup() {
        return {
            wtitle: ref("添加"),
            data: ref<Array<null>>([Object.create(null)]),
            columns,
            addEditVisible: ref(false),
            confirmLoading: ref(false),
            roleInfo: ref<{}>(Object.create(null)),
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            var _this = this;
            http("post", "/api-process/process/form/list", {})
                .then((data) => {
                    console.log(data);
                    if (data != null && data.length > 0) {
                        _this.data = data;
                    }
                })
                .catch(function (e) {
                    console.error(e);
                });
        },
        deleteProject: function (id: string) {
            var _this = this;
            http("get", "/api-process/process/form/delete", { id: id })
                .then(function (data) {
                    console.log(data);
                    _this.getList();
                })
                .catch(function (e) {
                    console.error(e);
                });
        },
        editProject: function (row: any) {
            this.$router.push({ path: '/comm/form/form-desinger', query: { formId: row.id } })
        },
        addProjet() {
            this.$router.push({ path: '/comm/form/form-desinger' })
        },
        viewer(row: any) {
            this.$router.push({ path: '/comm/form/form-viewer', query: { formId: row.id, isViewer: "1" } })
        }
    },
});
</script>
<style>
th.column-money,
td.column-money {
    text-align: right !important;
}
.add-button {
    text-align: right;
    margin-bottom: 10px;
}
.onSelect {
    -moz-user-select: -moz-none;
    user-select: none;
}
</style>