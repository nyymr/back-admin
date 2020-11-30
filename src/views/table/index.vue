<template>
  <div class="article">
    <el-form
      :inline="true"
      :model="searchMap"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="文章标题：">
        <el-input v-model="searchMap.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select
          v-model="searchMap.status"
          size="small"
          style="width: 110px"
          clearable
          filterable
        >
          <el-option
            v-for="(item, index) in status"
            :key="index"
            :label="item.statusText"
            :value="item.statusCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="search"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table_container">
      <el-table :data="tableData" border style="width: 100%" align="center">
        <el-table-column prop="id" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="title" label="文章标题" align="center">
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览数" align="center">
        </el-table-column>
        <el-table-column prop="thumhup" label="点赞数" align="center">
        </el-table-column>
        <el-table-column prop="ispublic" label="是否公开" align="center">
          <template slot-scope="scope">
            <el-tag type="warning" v-show="scope.row.ispublic == 1"
              >公开</el-tag
            >
            <el-tag type="danger" v-show="scope.row.ispublic != 1"
              >不公开</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status.toString() | filterType">{{
              scope.row.status | fliterStatus
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateDate" label="最后更新时间" align="center">
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="look(scope.row.id)"
              >查看</el-button
            >
            <el-button
              v-show="scope.row.status == 1"
              type="success"
              size="mini"
              @click="audit(scope.row.id)"
              >审核</el-button
            >
            <el-button
              v-show="scope.row.status != 0"
              type="danger"
              size="mini"
              @click="remove(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 弹出框 -->
    <Audit :id="detail.id" :show="detail.show" :title="detail.title" :formData="formData" :close="close"></Audit>
  </div>
</template>
<script>
import {
  getArticleList, //获取数据接口
  delArticle, //删除接口
  auditArticleSuccess, //审核通过接口
  auditArticleFail, //审核不通过接口
  lookArticle, //查看接口
} from "../../api/article";
import Audit from "../../components/edit/audit";
const status = [
  {
    statusCode: 0,
    statusText: "已删除",
  },
  {
    statusCode: 1,
    statusText: "未审核",
  },
  {
    statusCode: 2,
    statusText: "审核通过",
  },
  {
    statusCode: 3,
    statusText: "审核未通过",
  },
];
export default {
  data() {
    return {
      detail: {
        id:0,
        show: false,
        title: "",
      },
      status: status,
      searchMap: {},
      tableData: [],
      formData: {},
      page: {
        current: 1,
        size: 30,
        total: 0,
      },
    };
  },
  components: { Audit },
  methods: {},
  created() {
    this.getList();
  },
  methods: {
    //获取数据
    async getList() {
      const res = await getArticleList(
        this.searchMap,
        this.page.current,
        this.page.size
      );
      console.log(res);
      this.tableData = res.data.records;
      this.page.total = res.data.total;
    },
    //分页size
    handleSizeChange(val) {
      this.page.size = val;
      this.getList();
    },
    //页码
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    //重置
    reset() {
      this.formInline = {};
    },
    //查询
    async search() {
      const res = await getArticleList(
        this.searchMap,
        this.page.current,
        this.page.size
      );
      console.log(res);
      if (res.code == 20000) {
        this.$message({
          message: "查询成功",
          type: "success",
        });
        this.tableData = res.data.records;
        this.page.total = res.data.total;
      }
    },

    //查看
    async look(id) {
      this.detail.show = true;
      this.detail.id = id;
      this.detail.title = "文章详情";
      const res = await lookArticle(id);
      console.log(res);
      if (res.code == 20000) {
        this.formData = res.data;
      }
    },
    //审核
    async audit(id) {
      this.detail.show = true;
      this.detail.id = id;
      this.detail.title = "审核文章";
      const res = await lookArticle(id);
      console.log(res);
      if (res.code == 20000) {
        this.formData = res.data;
      }
    },
    //弹窗关闭时触发的事件,会传入到弹框组件,在弹框组件内调用
    close() {
      this.detail.show = false;
      this.getList();
    },
    //删除
    remove(id) {
      this.$confirm("确定删除该文章？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delArticle(id);
          console.log(res);
          if (res.code == 20000) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  filters: {
    fliterStatus(val) {
      if (val == 0) {
        return "已删除";
      } else if (val == 1) {
        return "未审核";
      } else if (val == 2) {
        return "审核通过";
      } else if (val == 3) {
        return "审核未通过";
      }
    },
    filterType(val) {
      if (val == 0) {
        return "danger";
      } else if (val == 1) {
        return "";
      } else if (val == 2) {
        return "success";
      } else if (val == 3) {
        return "warning";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.article {
  padding: 20px;
}
</style>