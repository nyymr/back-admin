<template>
  <div class="category">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="分类名称：">
        <el-input size="small" v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          size="small"
          style="width: 100px"
          clearable
          filterable
          v-model="formInline.status"
          placeholder="请选择"
        >
          <el-option label="正常" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >查询</el-button
        >
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="resetForm('formInline')"
          >重置</el-button
        >
        <el-button
          size="small"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="add"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="table_container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{ scope.row.id - 9 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" align="center">
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
              scope.row.status == 1 ? "正常" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="modify(scope.row.id)"
              >编辑</el-button
            >

            <el-button type="danger" size="small" @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="margin: 10px 0 0 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 编辑弹框 -->
    <Edit
      :title="edit.title"
      :show="edit.show"
      :formData="edit.formData"
      :close="close"
    ></Edit>
  </div>
</template>
<script>
import {
  getCategoryList,
  delCategoryList,
  getEditData,
  saveEditData,
} from "../../api/category";
import Edit from "../../components/edit/categoryEdit";
export default {
  components: { Edit },
  data() {
    return {
      formInline: {
        name: "",
        status: "",
      },
      tableData: [],
      current: 1,
      size: 20,
      total: 0,
      //编辑组件数据
      edit: {
        title: "",
        show: false,
        formData: {},
      },
    };
  },
  methods: {},
  created() {
    this.getList();
  },
  methods: {
    //获取数据
    async getList() {
      const res = await getCategoryList(this.current, this.size);
      this.tableData = res.data.records;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getList();
    },
    //删除
    async remove(id) {
      const res = await delCategoryList(id);
      console.log(res);
      if (res.code == 20000) {
        this.getList();
        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
    },
    //删除弹框
    del(id) {
      this.$confirm("确定删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.remove(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //搜索
    async search() {
      const res = await getCategoryList(
        this.formInline.name,
        this.formInline.status,
        this.current,
        this.size
      );
      console.log(res);
      this.tableData = res.data.records;
      this.total = res.data.total;
    },
    //重置
    resetForm(formInline) {
      // this.$refs[formInline].resetFields();
      this.formInline.name = "";
      this.formInline.status = "";
    },
    //新增
    add() {
      this.edit.show = true;
      this.edit.title = "新增";
      console.log(this.edit.show);
    },
    //编辑
    async modify(id) {
      this.edit.show = true;
      this.edit.title = "编辑";
      const res = await getEditData(id);
      console.log(res);
      if (res.code == 20000) {
        this.edit.formData = res.data;
      }
    },
    //弹窗关闭时触发的事件,会传入到弹框组件,在弹框组件内调用
    close() {
      this.edit.show = false;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.category {
  padding: 20px;
  .el-form-item {
    > .el-form-item__content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
</style>