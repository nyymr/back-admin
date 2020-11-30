<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    width="70%"
  >
    <el-form
      ref="formData"
      :model="formData"
      label-width="100px"
      label.position="right"
    >
      <el-form-item label="标题:">
        <el-input v-model="formData.title" readonly />
      </el-form-item>
      <el-form-item label="标签:">
        <el-cascader
          disabled
          style="display: block"
          v-model="formData.labelIds"
          :options="labelOptions"
          :props="{
            multiple: true,
            emitPath: false,
            children: 'labelList',
            value: 'id',
            label: 'name',
          }"
        />
      </el-form-item>
      <el-form-item label="主图:">
        <img
          :src="formData.imageUrl"
          class="avatar"
          style="width: 178px; heigth: 178px; display: block"
        />
      </el-form-item>

      <el-form-item label="是否公开:">
        <el-radio-group v-model="formData.ispublic" disabled>
          <el-radio :label="0">不公开 </el-radio>
          <el-radio :label="1">公开 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介:">
        <el-input
          v-model="formData.summary"
          type="textarea"
          :autosize="{ minRows: 2 }"
          readonly
        />
      </el-form-item>
      <el-form-item label="内容:">
        <mavon-editor ref="md" v-model="formData.mdContent" :editable="false" />
      </el-form-item>
      <el-form-item align="center" v-if="title == '审核文章'">
        <el-button @click="auditSuccess()" type="primary">审核通过</el-button>
        <el-button @click="auditFail()" type="danger">审核不通过</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  getLabelOptions,
  auditArticleSuccess,
  auditArticleFail,
} from "../../api/article";

import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  components: { mavonEditor },
  props: {
    id: {
      type: Number,
    },
    title: {
      type: String,
      default: "文章详情",
    },
    show: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
    },
    close: Function,
  },
  data() {
    return {
      labelOptions: [],
    };
  },
  created() {
    this.getLable();
  },
  methods: {
    handleClose() {
      this.close();
    },
    //获取分类数据
    async getLable() {
      const res = await getLabelOptions();
      if (res.code == 20000) {
        this.labelOptions = res.data;
      }
    },
    auditSuccess() {
      this.$confirm("确定通过审核？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await auditArticleSuccess(this.id);
          console.log(res);
          if (res.code == 20000) {
            this.$message({
              type: "success",
              message: "审核通过!",
            });
            this.handleClose();
          } else {
            this.$message({
              type: "error",
              message: "审核不通过!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核",
          });
        });
    },
    async auditFail() {
      this.$confirm("确定不通过审核？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await auditArticleFail(this.id);
          console.log(res);
          if (res.code == 20000) {
            this.$message({
              type: "success",
              message: "审核不通过!",
            });
            this.handleClose();
          } else {
            this.$message({
              type: "error",
              message: "审核失败!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>