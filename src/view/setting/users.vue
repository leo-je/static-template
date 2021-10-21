<template>
  <section>
    <div class="add-button">
      <a-config-provider :auto-insert-space-in-button="false">
        <a-button type="primary" @click="addProjet">添加</a-button>
      </a-config-provider>
    </div>
    <a-table :columns="columns" :data-source="data" bordered rowKey="id">
      <template #username="{ text }">
        <span>{{ text }}</span>
      </template>

      <template #sex="{ text }">
        <span>{{ text == "1" ? "男" : "女" }}</span>
      </template>

      <template #birthday="{ text }">
        <span>{{ formatTime(text) }}</span>
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
        <a-form :model="user">
          <a-form-item label="用户名称">
            <a-input placeholder="请输入用户名称" v-model:value="user.username" />
          </a-form-item>
          <a-form-item label="用户昵称">
            <a-input placeholder="请输入用户昵称" v-model:value="user.nickName" />
          </a-form-item>
          <a-form-item label="用户性别">
            <a-radio-group v-model:value="user.sex">
              <a-radio-button value="1">男</a-radio-button>
              <a-radio-button value="2">女</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="出生日期">
            <a-date-picker format="YYYY-MM-DD" v-model:value="user.birthday" />
          </a-form-item>
          <a-form-item label="主岗">
            <a-row>
              <a-col :span="11">
                <a-select
                  placeholder="请选择主岗"
                  v-model:value="user.mainRole.roleId"
                  :options="mainRoleOptions.data"
                />
              </a-col>
              <a-col :span="2"></a-col>
              <a-col :span="11">
                <a-tree-select
                  v-model:value="user.mainRole.groupId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="mainRoleGroupOptions.data"
                  :replace-fields="mainRoleGroupOptions.replaceFields"
                  placeholder="请选择主岗组织"
                  tree-default-expand-all
                ></a-tree-select>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import http from "../../utils/http";
import moment from "moment";
import { defineComponent, ref } from "vue";
// 表头配置
const columns = [
  {
    title: "用户名称",
    dataIndex: "username",
    slots: { customRender: "username" },
  },
  {
    title: "昵称",
    dataIndex: "nickName",
    slots: { customRender: "nickName" },
  },
  {
    title: "性别",
    dataIndex: "sex",
    slots: { customRender: "sex" },
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
    slots: { customRender: "birthday" },
  },
  {
    title: "备注信息",
    dataIndex: "remark",
    slots: { customRender: "remark" },
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

interface UserInfo {
  id: string,
  name: string,
  nickName: string,
  username: string,
  statusChecked: boolean,
  mainRole: MainRole,
  sex:string,
  birthday: any
}

interface MainRole {
  roleId: string,
  groupId: string,
}

interface MainRoleGroupOptions {
  roles?: any,
  replaceFields: ReplaceFields,
  data?: any,
}

interface ReplaceFields {
  title: string,
  key: string,
}

export default defineComponent({
  name: "SettingRoles",
  setup() {
    return {
      wtitle: "添加",
      data: ref([]),
      columns,
      addEditVisible: false,
      confirmLoading: false,
      user: ref<UserInfo>(Object.create(null)),
      mainRoleOptions: {
        roles: null,
        data: null,
      },
      mainRoleGroupOptions: ref<MainRoleGroupOptions>({
        replaceFields: {
          title: "name",
          key: "id",
        }
      }),
    };
  },
  mounted() {
    this.getList();
    this.getOptions();
  },
  methods: {
    getOptions() {
      let _this = this;
      // roles
      http("post", "/api-user/busi/roles/valid/list")
        .then(function (data: any) {
          console.log(data);
          if (data != null && data.length > 0) {
            _this.mainRoleOptions.roles = data;
            _this.mainRoleOptions.data = data.map((role: any) =>
              Object.assign({ value: role.id, label: role.name })
            );
            console.log(
              "_this.mainRoleOptions.data",
              _this.mainRoleOptions.data
            );
          }
        })
        .catch(function (e) {
          console.error(e);
        });
      // group
      http("get", "/api-user/busi/group/tree")
        .then(function (data) {
          console.log(data);
          if (data != null) {
            console.log(_this.mainRoleGroupOptions);
            let datas = [data];
            _this.setTreeNodeValue(datas);
            _this.mainRoleGroupOptions.data = datas;
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    setTreeNodeValue(nodes: Array<any>) {
      nodes.forEach((node) => {
        node.value = node.id;
        if (node.children != null && node.children.length > 0) {
          this.setTreeNodeValue(node.children);
        }
      });
    },
    getList() {
      var _this = this;
      http("post", "/api-user/busi/user/list")
        .then(function (data) {
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
      http("get", "/api-user/busi/user/delete", { id: id })
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row: any) {
      var _this = this;
      http("post", "/api-user/busi/user/info/" + row.id, {})
        .then(function (data) {
          console.log(data);
          let user = data;
          user.birthday = moment(user.birthday).format("YYYY/MM/DD HH:mm:ss");
          if (!user.mainRole) {
            user.mainRole = {};
          }
          if (user.status == "1") {
            user.statusChecked = true;
          } else {
            user.statusChecked = false;
          }
          _this.showWindows("编辑用户", user);
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    addProjet() {
      this.showWindows("添加用户", {
        mainRole: {
          id: "",
          group: {
            id: "",
          },
        },
      });
    },
    showWindows: function (title: string, row: any) {
      console.log(row);
      this.user = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    formatTime: function (text: any) {
      return moment(text).format("YYYY/MM/DD HH:mm:ss");
    },
    handleOk() {
      console.log(this.user);
      this.confirmLoading = true;
      var _this = this;
      this.user.birthday = moment(this.user.birthday).unix() * 1000;
      http("post", "/api-user/busi/user/save", this.user)
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
</style>