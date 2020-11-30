<template>
  <el-dialog
    :title="title"
    width="30%"
    :visible.sync="show"
    :before-close="handleClose"
    >
    <el-form
      :model="formData"
      :rules="rules"
      ref="reference"
      
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="1"
          :max="10"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="formData.remark"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { saveEditData, addCategory } from "../../api/category";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "新增",
    },
    formData: {
      type: Object,
    },
    close: Function,
  },
  data() {
    return {
      //表单验证规则
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        sort: [{ required: true, message: "请选择排序", trigger: "blur" }],
      },
    };
  },
  methods: {
    //关闭弹窗
    handleClose() {
      //重置表单
      // console.log(this.$refs["reference"]);
      this.$refs["reference"].resetFields();
      //父组件关闭回调
      this.close();
    },
    //提交确认
    submit() {
      console.log(this.formData);
      //validate表单验证,参数valid是boolean类型,通过true,反之false
      this.$refs["reference"].validate(async (valid) => {
        if (valid) {
          console.log("表单验证通过");
          //判断传入的参数中是否有id，若有触发编辑，若没有，触发新增
          if (this.formData.id) {
            this.updateCategory();
          } else {
            this.addCategory();
          }
        } else {
          console.log("表单验证失败");
        }
      });
    },
    //提交新增
    async addCategory() {
      const res = await addCategory(this.formData);
      if (res.code == 20000) {
        //关闭弹窗
        this.handleClose();
        this.$message({
          message: "添加成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "添加失败",
          type: "error",
        });
      }
    },
    //提交编辑
    async updateCategory() {
      const res = await saveEditData(this.formData);
      if (res.code == 20000) {
        //关闭弹窗
        this.handleClose();
        this.$message({
          message: "修改成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
  },
};
</script>