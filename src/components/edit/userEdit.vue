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
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickName">
        <el-input v-model="formData.nickName"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="账号过期：" prop="isAccountNonExpired">
        <el-radio-group v-model="formData.isAccountNonExpired">
          <el-radio border :label="1">未过期</el-radio>
          <el-radio border :label="0">已过期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码过期：" prop="isCredentialsNonExpired">
        <el-radio-group v-model="formData.isCredentialsNonExpired">
          <el-radio border :label="1">未过期</el-radio>
          <el-radio border :label="0">已过期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号锁定：" prop="isAccountNonLocked">
        <el-radio-group v-model="formData.isAccountNonLocked">
          <el-radio border :label="1">未锁定</el-radio>
          <el-radio border :label="0">已锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
        <el-button size="mini" @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getById, update, addUser } from "../../api/nestedUser";
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
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请输入昵称", trigger: "change" },
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        isAccountNonExpired: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        isCredentialsNonExpired: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        isAccountNonLocked: [
          { required: true, message: "请选择", trigger: "change" },
        ],
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
      const res = await getById(this.id);
      console.log(res);
      if (res.code == 20000) {
        this.formData = res.data;
      }
    },
    //编辑
    async edit() {
      const res = await update(this.formData);
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
      const res = await addUser(this.formData);
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