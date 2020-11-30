<template>
  <div class="category">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="标签名称：">
        <el-input size="small" v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称：">
        <el-select
          size="small"
          style="width:100px"
          clearable
          filterable
          v-model="formInline.categoryId"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
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
          @click="addShow = true"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <div class="table_container">
      <el-table :data="tableData" border style="width: 100%" align="center">
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.row.id - 9 }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标签名称" align="center"> </el-table-column>
        <el-table-column prop="categoryName" label="名称分类" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="getEditData(scope.row.id)"
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
    <el-dialog title="编辑" width="20%" :visible.sync="editShow">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="category">
          <el-select v-model="ruleForm.categoryId" placeholder="请选择活动区域">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEdit()" size="small"
            >确定</el-button
          >
          <el-button @click="editShow = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增弹框 -->
    <el-dialog title="新增" width="20%" :visible.sync="addShow">
      <el-form
        :model="addForm"
        :rules="rules_add"
        ref="addform"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="category">
          <el-select v-model="addForm.categoryId" placeholder="请选择活动区域">
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveAdd" size="small"
            >确定</el-button
          >
          <el-button @click="addShow = false" size="small">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLableList,
  getLableData,
  detLable,
  updateLable,
  addLable,
  getCategory,
} from "../../api/lable";
export default {
  data() {
    return {
      //头部表单数据
      formInline: {
        name: "", //标签名称
        categoryId: "", //分类id
      },
      tableData: [], //列表数据u
      current: 1, //页码
      size: 20, //条数
      total: 0, //总条数
      editShow: false, //编辑弹出框状态
      addShow: false, //新增弹出框状态
      ruleForm: {
        //编辑表单数据
        id: "", //标签id
        name: "", //标签名
        categoryId: "", //分类id
      },
      addForm: {
        //新增表单数据
        id: "", //标签id
        name: "", //标签名
        categoryId: "", //分类id
      },
      categoryList: [],
      //表单验证规则
      rules: {
        name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择分类名称", trigger: "blur" },
        ],
      },
      rules_add: {
        name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择分类名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {},
  created() {
    this.getList();
    getCategory().then((res) => {
      console.log(res);
      this.categoryList = res.data;
    });
  },
  methods: {
    //获取数据
    async getList() {
      const res = await getLableList(this.current, this.size);
      console.log(res);
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
      const res = await detLable(id);
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
    //获取编辑内容
    async getEditData(id) {
      this.editShow = true;
      this.ruleForm.id = id;
      const res = await getLableData(id);
      this.ruleForm.name = res.data.name;
      console.log(res);
    },
    //保存编辑
    async saveEdit() {
      console.log(this.ruleForm);
      this.editShow = false;

      const res = await updateLable(
        this.ruleForm.id,
        this.ruleForm.name,
        this.ruleForm.categoryId
      );

      console.log(res);
      if (res.code == 20000) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.getList();
      }
    },
    //搜索
    async search() {
      const res = await getLableList(
        this.formInline.name,
        this.formInline.categoryId
      );
      console.log(res);
      this.tableData = res.data.records;
      this.total = res.data.total;
    },
    //重置
    resetForm(formInline) {
      // this.$refs[formInline].resetFields();
      this.formInline.name = "";
      this.formInline.categoryId = "";
    },
    //新增
    async saveAdd() {
      const res = await addLable(this.addForm.name, this.addForm.categoryId);
      console.log(res);
      if ((res.code = 20000)) {
        this.$message({
          message: "新增成功",
          type: "success",
        });
        this.getList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.category {
    padding: 20px;
  .el-table {
    .cell {
      text-align: center;
    }
  }
  
  
}
</style>