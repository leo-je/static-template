<template>
  <section>
    <a-row>
      <a-col :span="24">
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
          <a-form-item label="clientId">
            <a-input placeholder="请输入clientId" v-model:value="group.clientId" />
          </a-form-item>
          <a-form-item label="有效时长">
            <a-input placeholder="请输入clientId" v-model:value="group.accessTokenValidity" />
          </a-form-item>
          <a-form-item label="认证方式">
            <a-input placeholder="请输入认证方式(逗号分隔)" v-model:value="group.authorizedGrantTypes" />
          </a-form-item>
          <a-form-item label="是否自动跳转">
            <a-radio-group v-model:value="group.autoapprove">
              <a-radio-button value="true">是</a-radio-button>
              <a-radio-button value="false">否</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="clientSecret">
            <a-input placeholder="请输入clientSecret" v-model:value="group.clientSecretValue" />
          </a-form-item>
          <a-form-item label="scope">
            <a-input placeholder="请输入scope" v-model:value="group.scope" />
          </a-form-item>
          <a-form-item label="重定向地址">
            <a-textarea placeholder="请输入重定向地址(逗号分隔)" v-model:value="group.webServerRedirectUri" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref, } from "vue";
import http from "@/utils/http";
import { Divider, Button, Row, Col, Modal, Form, FormItem, Switch, ConfigProvider, Table, Input, DirectoryTree, RadioGroup, RadioButton, Textarea } from "ant-design-vue";
import moment from "moment";
import { Oauth2Client } from "@/interface";
// 表头配置
const columns = [
  {
    title: "clientId",
    dataIndex: "clientId",
    slots: { customRender: "name" },
  },
  {
    title: "有效时长(秒)",
    dataIndex: "accessTokenValidity",
    slots: { customRender: "type" },
  },
  {
    title: "验证类型",
    //className: "column-projetInfo",
    dataIndex: "authorizedGrantTypes",
  },
  {
    title: "是否自动跳转",
    dataIndex: "autoapprove",
  },
  {
    title: "secret",
    //className: "column-projetInfo",
    dataIndex: "clientSecretValue",
  },
  {
    title: "scope",
    //className: "column-projetInfo",
    dataIndex: "scope",
  },
  {
    title: "重定向地址",
    //className: "column-projetInfo",
    dataIndex: "webServerRedirectUri",
  },
  {
    title: "操作",
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
    ARadioGroup: RadioGroup,
    ARadioButton: RadioButton,
    ATextarea: Textarea,
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
      group: ref<Oauth2Client>({
        accessTokenValidity: 3600,
        additionalInformation: null,
        authorities: null,
        authorizedGrantTypes: "",
        autoapprove: "",
        clientId: "",
        clientSecretValue: "",
        refreshTokenValidity: null,
        resourceIds: null,
        scope: "",
        webServerRedirectUri: "",
      }),
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      console.log("getList", this.treeData.selectedKeys);
      var _this = this;
      http("post", "/api-oauth2/oauth2/admin/client/list")
        .then(function (data) {
          console.log(data);
          _this.data = data;
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    deleteProject: function (clientId: string) {
      var _this = this;
      http("get", "/api-oauth2/oauth2/admin/client/delete", { clientId: clientId })
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row: Oauth2Client) {
      let user = JSON.parse(JSON.stringify(row));
      user.birthday = moment(user.birthday).format("YYYY/MM/DD HH:mm:ss");
      this.showWindows("编辑", user);
    },
    cleanObjectValue(ob: Oauth2Client) {
      ob = {
        accessTokenValidity: 3600,
        additionalInformation: undefined,
        authorities: undefined,
        authorizedGrantTypes: "",
        autoapprove: "",
        clientId: "",
        clientSecretValue: "",
        refreshTokenValidity: undefined,
        resourceIds: undefined,
        scope: "",
        webServerRedirectUri: ""
      }
      return ob;
    },
    addProjet() {
      console.log("add", this.treeData.selectedKeys);
      this.showWindows("添加", this.cleanObjectValue(this.group));
    },
    showWindows: function (title: string, row: Oauth2Client) {
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
      http("post", "/api-oauth2/oauth2/admin/client/add", this.group)
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