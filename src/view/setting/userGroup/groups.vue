<template>
  <section>
    <a-row>
      <a-col :span="4" class="group-tree-col">
        <div class="group-tree">
          <a-directory-tree
            :tree-data="treeData.data"
            v-model:selectedKeys="treeData.selectedKeys"
            :replace-fields="replaceFields"
            @select="selectTreeNode"
          ></a-directory-tree>
        </div>
      </a-col>
      <a-col :span="20">
        <div class="group-info-container">
          <div class="add-button">
            <a-config-provider :auto-insert-space-in-button="false">
              <a-button type="primary" @click="addProjet">添加</a-button>
            </a-config-provider>
          </div>
          <a-table :columns="columns" :data-source="data" bordered rowKey="id">
            <template #username="{ text }">
              <span>{{ text }}</span>
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
          </a-table>
        </div>
      </a-col>
    </a-row>

    <!-- 对话框 -->
    <div class="addEditWindown">
      <a-modal
        :title="wtitle"
        v-model:visible="addEditVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <a-form :model="group">
          <a-form-item label="用户组名称">
            <a-input placeholder="请输入用户组名称" v-model:value="group.name" />
          </a-form-item>
          <a-form-item label="用户组类型">
            <a-input placeholder="请输入用户组类型" v-model:value="group.type" />
          </a-form-item>

          <a-form-item label="状态">
            <a-switch v-model:checked="group.statusChecked" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref, } from "vue";
import http from "@/utils/http";
import { Divider, Button, Row, Col, Modal, Form, FormItem, Switch, ConfigProvider, Table, Input, DirectoryTree } from "ant-design-vue";
import moment from "moment";
import { GroupInfo } from "@/interface";
// 表头配置
const columns = [
  {
    title: "用户组名称",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
  {
    title: "用户组类型",
    dataIndex: "type",
    slots: { customRender: "type" },
  },
  {
    title: "状态",
    //className: "column-projetInfo",
    dataIndex: "status",
    slots: { customRender: "status" },
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];
export default defineComponent({
  name: "SettingGroups",
  components: {
    ADivider: Divider,
    AButton: Button,
    ARow: Row,
    ACol: Col, AModal: Modal,
    AForm: Form, AFormItem: FormItem,
    ASwitch: Switch,
    AConfigProvider: ConfigProvider,
    ATable: Table,
    AInput: Input,
    ADirectoryTree: DirectoryTree,
  },
  setup() {
    const selectedKeys = [""];
    let data: any[] = []
    return {
      wtitle: ref("添加"),
      data: ref([]),
      columns,
      addEditVisible: ref(false),
      confirmLoading: ref(false),
      treeData: ref({
        selectedKeys,
        data: data,
      }),
      replaceFields: ref({
        title: "name",
        key: "id",
      }),
      group: ref<GroupInfo>({
        id: "",
        name: "",
        statusChecked: true,
        type: ""
      }),
    };
  },
  mounted() {
    this.getTree();
  },
  methods: {
    getTree() {
      var _this = this;
      http("get", "/api-user/busi/group/tree")
        .then(function (data: any) {
          console.log(_this.treeData);
          console.log(data);
          if (data != null && data.data) {
            _this.treeData.data = [Object.assign({}, data.data)];
            if (!_this.treeData.selectedKeys) {
              _this.treeData.selectedKeys = [data.id];
            }
            _this.getList(_this.treeData.selectedKeys[0]);
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    getList(pid: string | null) {
      console.log("getList", this.treeData.selectedKeys);
      var _this = this;
      http("get", "/api-user/busi/group/all/list", { pid })
        .then(function (data) {
          console.log(data);
          _this.data = data;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    deleteProject: function (id: string) {
      var _this = this;
      http("get", "/api-user/busi/user/delete", { id: id })
        .then(function (data) {
          console.log(data);
          _this.getList(null);
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row: GroupInfo) {
      if (row.status == "1") {
        row.statusChecked = true;
      } else {
        row.statusChecked = false;
      }
      let user = JSON.parse(JSON.stringify(row));
      user.birthday = moment(user.birthday).format("YYYY/MM/DD HH:mm:ss");
      this.showWindows("编辑用户", user);
    },
    addProjet() {
      console.log("add", this.treeData.selectedKeys);
      this.showWindows("添加用户", {});
    },
    showWindows: function (title: string, row: GroupInfo) {
      console.log(row);
      this.group = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    formatTime: function (text: string) {
      console.log(text);
      return moment(text).format("YYYY/MM/DD HH:mm:ss");
    },
    handleOk() {
      console.log(this.group);
      this.confirmLoading = true;
      var _this = this;
      this.group.pId = this.treeData.selectedKeys[0];
      if (this.group.statusChecked) {
        this.group.status = "1";
      } else {
        this.group.status = "0";
      }
      http("post", "/api-user/busi/group/save", this.group)
        .then(function (data) {
          console.log(data);
          _this.addEditVisible = false;
          _this.confirmLoading = false;
          _this.getTree();
        })
        .catch(function (e) {
          console.error(e);
          _this.confirmLoading = false;
        });
    },
    selectTreeNode(key: string[]) {
      console.log("selectTreeNode", key);
      this.getList(key[0]);
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
.group-tree-col {
  text-align: left;
  background-color: azure;
}
.group-info-container {
  margin-left: 10px;
}
</style>