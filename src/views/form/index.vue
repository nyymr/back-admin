<template>
  <div class="advert">
    <el-form
      :inline="true"
      :model="searchMap"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="广告标题：" prop="name">
        <el-input v-model="searchMap.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchMap.status"
          size="mini"
          style="width: 110px"
          clearable
          filterable
        >
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
        </el-select>
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

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="title" label="广告标题" align="center">
      </el-table-column>
      <el-table-column label="广告图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 90px; height: 60px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="advertUrl" label="广告链接" align="center">
      </el-table-column>
      <el-table-column label="状态" clearable filterable align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{
            scope.row.status == 1 ? "正常" : "禁用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" @click="remove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AdvertEdit
      :show="edit.show"
      :formData="edit.formData"
      :title="edit.title"
      :close="close"
      :oldImageUrl="edit.oldImageUrl"
    ></AdvertEdit>
    <!-- 分页 -->
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
</template>
<script>
import {
  getAdvertList,
  addAdvert,
  getOneAdvertData,
  updateAdvert,
  delAdvert,
} from "../../api/advert";
import AdvertEdit from "../../components/edit/advertEdit";
export default {
  data() {
    return {
      searchMap: {},
      page: {
        current: 1,
        size: 20,
        total: 0,
      },
      tableData: [],
      edit: {
        title: "",
        show: false,
        formData: {},
        oldImageUrl: "",
      },
    };
  },
  components: {
    AdvertEdit,
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取数据
    async getList() {
      const res = await getAdvertList(
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

    //重置
    reset() {
      // this.formInline = {};
      this.$refs["formInline"].resetFields();
    },
    //搜索
    search() {
      this.getList();
    },
    //新增
    add() {
      this.edit.title = "新增";
      this.edit.show = true;
    },
    //编辑
    async onEdit(id) {
      const res = await getOneAdvertData(id);
      console.log(res);
      if (res.code == 20000) {
        this.edit.formData = res.data;
        this.edit.show = true;
        this.edit.title = "编辑";
        this.edit.oldImageUrl = this.edit.formData.imageUrl;
      }
    },
    //删除
    remove(id) {
      this.$confirm("确定要删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(id);
          const res = await delAdvert(id);
          console.log(res);
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
    //关闭弹窗方法
    close() {
      this.edit.show = false;
      this.getList();
    },
  },
};
</script>
<style scoped>
  .advert{
    padding: 20px;
  }
</style>