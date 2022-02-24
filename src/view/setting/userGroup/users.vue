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
    </a-table>

    <!-- 对话框 -->
    <div class="addEditWindown">
      <a-modal
        :title="wtitle"
        v-model:visible="addEditVisible"
        :confirm-loading="confirmLoading"
        width="700px"
        @ok="handleOk"
      >
        <a-form
          :model="user"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          labelAlign="left"
        >
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
          <a-form-item label="主要角色">
            <a-row>
              <a-col :span="11">
                <a-select
                  placeholder="请选择角色"
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
          <a-form-item label="其他角色">
            <a-button
              class="editable-add-btn"
              style="margin-bottom: 8px"
              @click="() => {
                const newData = {
                  key: (user.roles?.length + '' || '1')
                };
                user.roles ? user.roles.push(newData) : (user.roles = [newData])
              }"
            >添加</a-button>
            <a-table bordered :pagination="false" :data-source="user.roles" :columns="rolesColumns">
              <template #roleName="{ text, record }">
                <div class="editable-cell">
                  <div v-if="newRoleRow[record.key]" class="editable-cell-input-wrapper">
                    <a-select
                      v-model:value="newRoleRow[record.key].roleId"
                      placeholder="其他角色"
                      :options="mainRoleOptions.data"
                    ></a-select>
                    <check-outlined
                      class="editable-cell-icon-check"
                      @click="edit_select_roles_save(record.key)"
                    />
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }}
                    <edit-outlined
                      class="editable-cell-icon"
                      @click="edit_select_roles_edit(record)"
                    />
                  </div>
                </div>
              </template>

              <template #groupName="{ text, record }">
                <div class="editable-cell">
                  <div v-if="newRoleRow[record.key]" class="editable-cell-input-wrapper">
                    <a-tree-select
                      v-model:value="newRoleRow[record.key].groupId"
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="mainRoleGroupOptions.data"
                      :replace-fields="mainRoleGroupOptions.replaceFields"
                      placeholder="请选择组织"
                      tree-default-expand-all
                    ></a-tree-select>
                    <check-outlined
                      class="editable-cell-icon-check"
                      @click="edit_select_roles_save(record.key)"
                    />
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }}
                    <edit-outlined
                      class="editable-cell-icon"
                      @click="() => {
                        let rs = user.roles?.filter(r => r.key == record.key)
                        newRoleRow[record.key] = Object.assign({}, rs && rs.length == 1 ? rs[0] : {})
                      }"
                    />
                  </div>
                </div>
              </template>

              <template #operation="{ record }">
                <a-popconfirm
                  v-if="user.roles?.length"
                  title="确认删除?"
                  @confirm="edit_select_roles_delete(record)"
                >
                  <a>删除</a>
                </a-popconfirm>
              </template>
            </a-table>
          </a-form-item>
          <a-form-item label="备注信息">
            <a-textarea v-model:value="user.remark" placeholder="备注信息" :rows="4" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import moment from "moment";
import {
  Row, Select, Input, Table, Col, Form, Modal, FormItem, TreeSelect, DatePicker, RadioButton,
  RadioGroup, Divider, Button, ConfigProvider, Popconfirm,Textarea
} from "ant-design-vue";
import { defineComponent, ref, UnwrapRef, reactive } from "vue";
import { MainRoleGroupOptions, mainRoleOptions, UserInfo, MainRole } from "@/interface";
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import http from "@/utils/http";
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
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const rolesColumns = [
  {
    title: "角色名称",
    dataIndex: "roleName",
    slots: { customRender: 'roleName' },
  },
  {
    title: "适用组织",
    dataIndex: "groupName",
    slots: { customRender: 'groupName' },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  },
]

export default defineComponent({
  name: "SettingRoles",
  components: {
    ARow: Row,
    ASelect: Select,
    AInput: Input,
    ATable: Table,
    ACol: Col,
    AForm: Form,
    AModal: Modal,
    AFormItem: FormItem,
    ATreeSelect: TreeSelect,
    ADatePicker: DatePicker,
    ARadioButton: RadioButton,
    ARadioGroup: RadioGroup,
    ADivider: Divider,
    AButton: Button,
    AConfigProvider: ConfigProvider,
    CheckOutlined,
    EditOutlined,
    APopconfirm: Popconfirm,
    ATextarea:Textarea,
  },
  setup() {
    const newRoleRow: UnwrapRef<Record<string, MainRole>> = reactive({});
    return {
      wtitle: "添加",
      data: ref([]),
      columns, // 主列表表头
      rolesColumns, // 编辑对话框角色列表表头
      addEditVisible: ref(false),
      confirmLoading: ref(false),
      user: ref<UserInfo>({ mainRole: {} }),
      mainRoleOptions: ref<mainRoleOptions>(Object.create(null)),
      mainRoleGroupOptions: ref<MainRoleGroupOptions>({
        replaceFields: {
          title: "name",
          key: "id",
        }
      }),
      newRoleRow,
    };
  },
  mounted() {
    this.getList();
    this.getOptions();
  },
  methods: {
    edit_select_roles_edit(record: MainRole) {
      let rs = this.user.roles?.filter(r => r.key == record.key)
      this.newRoleRow[record.key || ''] = Object.assign({}, rs && rs.length == 1 ? rs[0] : {})
    },
    edit_select_roles_delete(record: MainRole) {
      this.user.roles = this.user.roles?.filter(role => role.key !== record.key)

    },
    edit_select_roles_save(key: string) {
      console.log(key)
      let role = this.getRoleInfoFromRoleOptions(this.newRoleRow[key].roleId)
      if (role) {
        this.newRoleRow[key].roleName = role.name
      }
      let group = this.getGroupFromGroupOptions(this.newRoleRow[key].groupId || '')
      if (group) {
        this.newRoleRow[key].groupName = group.name
      }
      Object.assign(this.user.roles?.filter(item => key === item.key)[0], this.newRoleRow[key]);
      delete this.newRoleRow[key];

    },
    getRoleInfoFromRoleOptions(roleId?: string): any {
      let roles = this.mainRoleOptions.roles?.filter(item => roleId === item.id)
      if (roles && roles.length == 1) {
        return roles[0]
      }
      return null
    },
    getGroupFromGroupOptions(groupId: string): any {
      let group = this.getGroupFromArray(groupId, this.mainRoleGroupOptions.data)
      return group
    },
    getGroupFromArray(groupId: string, array: []): any {
      let group = null
      for (let i = 0; i < array.length; i++) {
        if (groupId === array[i]["id"]) {
          return array[i]
        }
        if (array[i]["children"]) {
          group = this.getGroupFromArray(groupId, array[i]["children"])
          if (group) {
            return group;
          }
        }
      }
      return group
    },
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
        .then(function (data: UserInfo) {
          console.log(data);
          let user = data;
          console.log()
          user.birthday = moment(user.birthday).format("YYYY/MM/DD HH:mm:ss");
          if (!user.mainRole) {
            user.mainRole = {};
          }
          user.roles?.map(role => {
            role.key = role.roleId + '' + role.groupId
            let roleOp = _this.getRoleInfoFromRoleOptions(role.roleId)
            if (roleOp) {
              role.roleName = roleOp.name
            }

            let group = _this.getGroupFromGroupOptions(role.groupId || '')
            if (group) {
              role.groupName = group.name
            }
            console.log(role)
          })
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
      this.showWindows("添加用户", { mainRole: { roleId: "", groupId: "" } });
    },
    showWindows: function (title: string, row: UserInfo) {
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