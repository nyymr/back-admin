<template>
  <el-dialog
    :title="title"
    :visible.sync="showEdit"
    :before-close="handleClose"
    width="30%"
  >
    <el-form
      :model="formData"
      ref="formData"
      label-width="100px"
      :rules="rules"
      style="width: 90%"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          v-model="formData.remark"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getRoleDateById, updateRoleData, addRole } from "../../api/role";
export default {
  props: {
    showEdit: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "编辑",
    },
    id: {
      type: Number,
      default: 0,
    },
    close: Function,
  },
  data() {
    return {
      formData: {},
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
    };
  },
  watch: {
    id(val) {
      if (val) {
        this.getUserData();
      }
    },
  },
  methods: {
    handleClose() {
      this.$refs["formData"].resetFields();
      this.close();
    },
    submit() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          console.log("表单验证成功");
          if (this.id) {
            this.edit();
          }
        } else {
          console.log("表单验证失败");
        }
      });
    },
    //获取编辑数据并回显
    async getUserData() {
      const res = await getRoleDateById(this.id);
      console.log(res);
      if (res.code == 20000) {
        this.formData = res.data;
      }
    },
    //编辑
    async edit() {
      const res = await updateRoleData(this.formData);
      if ((res.code = 20000)) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.handleClose();
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
    //新增
    async add() {
      const res = await addRole(this.formData);
      if ((res.code = 20000)) {
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.handleClose();
      } else {
        this.$message({
          message: "添加失败",
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>