<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    width="30%"
  >
    <el-form
      :model="formData"
      label-width="100px"
      ref="formData"
      :rules="rules"
    >
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3" v-show="parentId == 1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动区域" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="请求地址" prop="url">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          width="100%"
          v-model="formData.sort"
          :min="1"
          :max="999"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="formData.remark">
        </el-input>
      </el-form-item>
      <el-form-item>
        <template>
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="submit"
            >确 定</el-button
          >
        </template>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getById, updateMenu, addMenu } from "../../api/menu";
export default {
  props: {
    id: {
      type: Number,
    },
    title: {
      type: String,
      default: "新增",
    },
    show: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: Number,
      default: 1,
    },
    close: Function,
  },
  data() {
    return {
      formData: {},
      rules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入权限标识", trigger: "blur" }],
      },
    };
  },
  watch: {
    id(val) {
      console.log(val);
      if (val) {
        this.getFormdata();
      }
    },
  },
  methods: {
    handleClose() {
      this.$refs["formData"].resetFields();
      this.close();
    },
    //提交
    submit() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          if (this.id) {
            this.update();
          } else {
            this.add();
          }
        } else {
          console.log("数据验证失败");
        }
      });
    },
    //编辑数据回显查询
    async getFormdata() {
      const res = await getById(this.id);
      console.log(res);
      if (res.code == 20000) {
        this.formData = res.data;
      }
    },

    //编辑
    async update() {
      const res = await updateMenu(this.formData);
      console.log(res);
      if (res.code == 20000) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.handleClose();
      } else {
        this.$message({
          message: "保存失败",
          type: "error",
        });
      }
    },

    //新增
    async add() {
      const res = await addMenu(this.formData);
      console.log(res);
      if (res.code == 20000) {
        this.$message({
          message: "新增成功",
          type: "success",
        });
        this.handleClose();
      } else {
        this.$message({
          message: "新增失败",
          type: "error",
        });
      }
    },
  },
};
</script>
