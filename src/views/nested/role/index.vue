<template>
  <div class="role">
    <!-- 表单 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="角色名称:" prop="name">
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
          @click="add"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" type="index">
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名" >
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="open(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="success" size="mini" @click="update(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="remove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin: 10px 0 0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </div>
    <!-- 编辑弹框 -->
    <RoleEdit
      :title="edit.title"
      :id="edit.id"
      :showEdit="edit.show"
      :close="close"
    ></RoleEdit>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="form.visible" width="40%">
      <el-form :model="form">
        <el-form-item>
          <el-tree
            :data="form.treeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="form.menuIds"
            :props="form.defaultProps"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="">
          <el-button size="mini" type="primary" @click="submitForm"
          style="margin-left:100px"
            >确 定</el-button
          >
          <el-button size="mini" @click="form.visible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import RoleEdit from "../../../components/edit/roleEdit";
import { getMenuList } from "../../../api/menu";
import {
  getRoleList,
  deleteRoleById,
  getMenuIdsByRoleId,
  saveRoleMenu,
} from "../../../api/role";
export default {
  data() {
    return {
      searchMap: {},
      page: {
        total: 0,
        current: 1,
        size: 20,
      },
      tableData: [],
      edit: {
        id: 0,
        show: false,
        title: "",
      },
      //分配权限
      form: {
        id: 0,
        treeData: [],
        visible: false,
        defaultProps: {
          children: "children",
          label: "name",
        },
        menuIds: [],
      },
    };
  },

  created() {
    this.getList();
  },
  components: {
    RoleEdit,
  },
  methods: {
    //获取数据
    async getList() {
      const res = await getRoleList(
        this.searchMap,
        this.page.current,
        this.page.size
      );
      console.log(res);
      if (res.code == 20000) {
        this.tableData = res.data.records;
        this.page.total = res.data.total;
      }
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    //搜索
    search() {
      this.getList();
    },
    //重置
    reset() {
      this.$refs["formInline"].resetFields();
    },
    //新增
    add() {
      this.edit.show = true;
      this.edit.title = "新增";
    },
    //编辑
    update(id) {
      this.edit.id = id;
      this.edit.show = true;
      this.edit.title = "编辑";
    },
    //删除
    remove(id) {
      this.$confirm("确定要删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteRoleById(id);
          if (res.code == 20000) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          } else {
            this.$message({
              type: "danger",
              message: "删除失败!",
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
    close() {
      this.edit.show = false;
      this.getList();
    },
    //打开分配权限弹出框
    open(id) {
      this.form.id = id;
      this.form.visible = true;
      this.getMenus();
      this.getMenuIds(id);
    },
    //通过角色id查询所拥有的菜单ids
    async getMenuIds(id) {
      const res = await getMenuIdsByRoleId(id);
      console.log(res);
      if (res.code == 20000) {
        this.form.menuIds = res.data;
      }
    },
    //获取菜单列表数据局
    async getMenus() {
      const res = await getMenuList({});

      if (res.code == 20000) {
        this.form.treeData = res.data;
      }
    },
    //保存权限分配
    async submitForm() {
      this.form.visible = false;
      const res = await saveRoleMenu(this.form.id, this.form.menuIds);
      console.log(res);
      if (res.code == 20000) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "保存失败",
          type: "danger",
        });
      }
    },
  },
};
</script>
<style scoped>
    .role{
        padding: 20px;
    }
</style>