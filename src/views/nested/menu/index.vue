<template>
  <div class="menu">
    <!-- 表单 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="searchMap.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="reset"
          >重置</el-button
        >
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addTop"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" row-key="name">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" label="名称" prop="name">
      </el-table-column>
      <el-table-column align="center" label="请求地址" prop="url">
      </el-table-column>
      <el-table-column align="center" label="权限标识" prop="code">
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">目录</span>
          <span v-if="scope.row.type === 2">菜单</span>
          <span v-if="scope.row.type === 3">按钮</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sort">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addRow()"
            >新增</el-button
          >
          <el-button size="mini" type="success" @click="onEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="remove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <MenuEdit
      :show="show"
      :id="id"
      :parentId="parentId"
      :close="close"
      :title="title"
    ></MenuEdit>
  </div>
</template>
<script>
import { getMenuList, deleteById } from "../../../api/menu";
import MenuEdit from "../../../components/edit/menuEdit";
export default {
  data() {
    return {
      searchMap: {},
      tableData: [],
      show: false,
      title: "",
      id: 0,
      parentId: 1,
    };
  },
  components: {
    MenuEdit,
  },
  created() {
    this.getlist();
  },
  methods: {
    //获取列表数据
    async getlist() {
      const res = await getMenuList(this.searchMap);
      console.log(res);
      if (res.code == 20000) {
        this.tableData = res.data;
      }
    },
    //删除
    remove(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteById(id);
          if (res.code == 20000) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getlist();
          } else {
            this.$message({
              message: "删除失败",
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //查询
    search() {
      this.getlist();
    },
    //重置
    reset() {
      this.$refs["formInline"].resetFields();
    },
    //关闭弹框组件
    close() {
      this.show = false;
    },
    //编辑
    onEdit(id) {
      this.id = id;
      this.parentId = 1;
      this.show = true;
      this.title = "编辑";
    },
    //添加
    addTop() {
      this.parentId = 0;
      this.show = true;
      this.title = "新增";
    },
    addRow() {
      this.parentId = 1;
      this.show = true;
      this.title = "新增";
    },
  },
};
</script>
<style scoped>
    .menu{
        padding: 20px;
    }
</style>