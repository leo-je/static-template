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
          <a class="onSelect" @click="deleteProject(record.id)">删除</a>
          <a-divider type="vertical" />
          <a class="onSelect" @click="editProject(record)">编辑</a>
        </span>
      </template>
      <!-- <template #title="">
      Header
      </template>-->

      <!-- <template #footer="">
      Footer
      </template>-->
    </a-table>

    <!-- 对话框 -->
    <div class="addEditWindown">
      <a-modal
        :title="wtitle"
        v-model:visible="addEditVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <a-form :model="roleInfo">
          <a-form-item label="角色名称">
            <a-input placeholder="请输入角色名称" v-model:value="roleInfo.name" />
          </a-form-item>
          <a-form-item label="角色状态">
            <a-switch v-model:checked="roleInfo.statusChecked" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Button, ConfigProvider, Table, Form, Modal, Switch, FormItem, Divider, Input } from 'ant-design-vue';
import { RoleInfo } from '@/interface';
import http from "@/utils/http";

// 表头配置
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
  {
    title: "角色状态",
    //className: "column-projetInfo",
    dataIndex: "status",
    slots: { customRender: "status" },
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
  name: "SettingRoles",
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
      data: ref<Array<RoleInfo>>([Object.create(null)]),
      columns,
      addEditVisible: ref(false),
      confirmLoading: ref(false),
      roleInfo: ref<RoleInfo>(Object.create(null)),
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      var _this = this;
      http("post", "/api-user/busi/roles/all/list")
        .then(function (data: RoleInfo[]) {
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
      http("get", "/api-user/busi/roles/delete", { id: id })
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row: RoleInfo) {
      if (row.status == "1") {
        row.statusChecked = true;
      } else {
        row.statusChecked = false;
      }
      this.showWindows("编辑角色", JSON.parse(JSON.stringify(row)));
    },
    addProjet() {
      this.showWindows("添加角色", {});
    },
    showWindows: function (title: string, row: RoleInfo) {
      console.log(row);
      this.roleInfo = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    handleOk() {
      console.log(this.roleInfo);
      this.confirmLoading = true;
      var _this = this;
      if (this.roleInfo.statusChecked) {
        this.roleInfo.status = "1";
      } else {
        this.roleInfo.status = "0";
      }
      http("post", "/api-user/busi/roles/save", this.roleInfo)
        .then(function (data) {
          console.log(data);
          _this.addEditVisible = false;
          _this.confirmLoading = false;
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
          _this.confirmLoading = false;
        });
      // setTimeout(() => {
      //   this.addEditVisible = false;
      //   this.confirmLoading = false;
      // }, 2000);
    },
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