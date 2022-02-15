<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="流程名称" width="280" />
      <el-table-column prop="key" label="流程key" width="280" />
      <el-table-column prop="version" label="版本" width="250" />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleClick1(scope.$index, scope.row)">
            <span>设计</span>
          </el-button>
          <el-button type="text" size="small" @click="handleClick2(scope.$index, scope.row)">
            <span>{{ scope.row.isSuspended ? '开启' : '挂起' }}</span>
          </el-button>
          <el-button type="text" size="small" @click="handleClick3(scope.$index, scope.row)">
            <span>预览</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import http from '@/utils/http';

export default defineComponent({
  setup() {
    return {
      tableData: ref([]),
    };
  },

  mounted() {
    console.log('=================> processList');
    this.getData();
  },
  beforeCreate() {
    console.log();
  },
  methods: {
    getData() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this;
      http('post', '/api-process/process/definition/list').then((data) => {
        console.log(data);
        _this.tableData = data;
      });
    },
    handleClick1(e: any, row: any) {
      console.log(e);
      console.log(row);
      this.$router.push({ path: '/process/panel', query: row });
    },
    handleClick2(e: any, row: any) {
      console.log(e);
      console.log(row);
    },
    handleClick3(path: string, row: any) {
      // this.$router.push({ path: '/process/viewer', query: row });
      const { href } = this.$router.resolve({
        path: `/process/viewer`,
        query: row,
      });
      window.open(href, '_blank');
    },
    to(path: string) {
      this.$router.push({ path });
    },
  },
});
</script>

<style type="less" scoped>
.el-main {
  line-height: 0px;
}
</style>
