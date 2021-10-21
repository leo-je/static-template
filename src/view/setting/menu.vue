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
        <a-form :model="form">
          <a-form-item label="菜单名称">
            <a-input placeholder="菜单名称" v-model:value="form.name" />
          </a-form-item>
          <a-form-item label="菜单路径">
            <a-input placeholder="菜单路径" v-model:value="form.path" />
          </a-form-item>

          <a-form-item label="组件路径">
            <a-input placeholder="组件路径" v-model:value="form.componentPath" />
          </a-form-item>

          <a-form-item label="菜单图标">
            <a-input placeholder="菜单图标" v-model:value="form.iconName" />
          </a-form-item>

          <a-form-item label="菜单排序值">
            <a-input placeholder="菜单排序值" v-model:value="form.sort" />
          </a-form-item>

          <a-form-item label="状态">
            <a-switch v-model:checked="form.statusChecked" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import http from "../../utils/http";
import moment from "moment";
// 表头配置
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    slots: { customRender: "name" },
  },
  {
    title: "路径",
    dataIndex: "path",
    slots: { customRender: "path" },
  },
    {
    title: "排序",
    dataIndex: "sort",
    slots: { customRender: "sort" },
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

interface MenuInfo {
  id: string,
  name: string,
  path: string,
  componentPath: string,
  statusChecked: true,
  pId: string,
  status: string,
  iconName: string,
  sort: number
}

export default defineComponent({
  name: "SettingMenu",
  setup() {
    const selectedKeys: Array<string> = [];
    // watch(selectedKeys, () => {
    //   console.log("selectedKeys", selectedKeys);
    // });
    return {
      wtitle: ref("添加"),
      data: ref([]),
      columns,
      addEditVisible: ref(false),
      confirmLoading: ref(false),
      treeData: ref({
        selectedKeys,
        data: [Object.create(null)],
      }),
      replaceFields: ref({
        title: "name",
        key: "id",
      }),
      form: ref<MenuInfo>(Object.create(null)),
    };
  },
  mounted() {
    this.getTree();
  },
  methods: {
    getTree() {
      var _this = this;
      http("get", "/api-user/busi/menu/all/tree")
        .then(function (data) {
          console.log(_this.treeData);
          console.log(data);
          if (data != null) {
            const _data = [Object.assign({}, data)];
            _this.treeData.data = _data;
            if (!_this.treeData.selectedKeys) {
              _this.treeData.selectedKeys = [Object.assign({ id: "" }, data).id];
            }
            _this.getList(_this.treeData.selectedKeys[0]);
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    getList(pid?: string) {
      console.log("getList", this.treeData.selectedKeys);
      var _this = this;
      http("get", "/api-user/busi/menu/all/list", { pid })
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
      http("delete", "/api-user/busi/menu/" + id)
        .then(function (data) {
          console.log(data);
          _this.getList();
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    editProject: function (row: any) {
      if (row.status == "1") {
        row.statusChecked = true;
      } else {
        row.statusChecked = false;
      }
      let user = JSON.parse(JSON.stringify(row));
      user.birthday = moment(user.birthday).format("YYYY/MM/DD HH:mm:ss");
      this.showWindows("编辑菜单", user);
    },
    addProjet() {
      console.log("add", this.treeData.selectedKeys);
      this.showWindows("添加菜单", {});
    },
    showWindows: function (title: string, row: any) {
      console.log(row);
      this.form = row;
      this.wtitle = title;
      this.addEditVisible = true;
    },
    formatTime: function (text: string) {
      console.log(text);
      return moment(text).format("YYYY/MM/DD HH:mm:ss");
    },
    handleOk() {
      console.log(this.form);
      this.confirmLoading = true;
      var _this = this;
      this.form.pId = this.treeData.selectedKeys[0];
      if (this.form.statusChecked) {
        this.form.status = "1";
      } else {
        this.form.status = "0";
      }
      http("post", "/api-user/busi/menu/save", this.form)
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
    selectTreeNode(key: any, e: any) {
      console.log("selectTreeNode", key);
      this.getList(key[0]);
    },
  },
});
</script>
<style scoped>
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