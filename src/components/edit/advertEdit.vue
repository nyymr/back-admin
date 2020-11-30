<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="show"
      :before-close="handleClose"
      width="600px"
    >
      <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
      <el-form
        status-icon
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="100px"
        label-position="right"
        style="width: 500px"
      >
        <el-form-item label="广告图片:" prop="imageUrl">
          <!-- 
accept="image/png, image/jpeg" ：接收上传的类型
action 指定上传地址，但是我们不用它默认的，所以给它空的，不能把它删除，默认这个必须要有
show-file-list 是否显示已上传文件列表，因为上传的是图片，不是文件，所以不要显示
http-request 自定义上传实现
-->
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            action=""
            :show-file-list="false"
            :http-request="uploadMainImg"
          >
            <img
              v-if="formData.imageUrl"
              :src="formData.imageUrl"
              class="avatar"
            />
            
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告标题:" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="广告链接:" prop="advertUrl">
          <el-input v-model="formData.advertUrl" />
        </el-form-item>
        <el-form-item label="跳转方式:" prop="advertTarget">
          <el-select
            v-model="formData.advertTarget"
            clearable
            style="width: 185px"
          >
            <el-option label="新窗口打开" value="_blank"></el-option>
            <el-option label="当前窗口打开" value="_self"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告位置:" prop="position">
          <el-input-number
            style="width: 300px"
            v-model="formData.position"
            :min="1"
            :max="10000"
          />
        </el-form-item>

        <el-form-item label="排序:" prop="sort">
          <el-input-number
            style="width: 300px"
            v-model="formData.sort"
            :min="1"
            :max="10000"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('formData')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadImg, deleteImg } from "../../api/image";
import { addAdvert, updateAdvert } from "../../api/advert";

export default {
  props: {
    title: {
      type: String,
      default: "编辑",
    },
    show: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: {},
    },
    oldImageUrl: String,
    close: Function,
  },
  data() {
    return {
      rules: {
        // 校验规则
        imageUrl: [
          { required: true, message: "请上传广告图片", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
        advertUrl: [
          { required: true, message: "请输入广告链接", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        advertTarget: [
          { required: true, message: "请选择跳转方式", trigger: "change" },
        ],
        position: [
          { required: true, message: "请输入广告位置", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose() {
      this.$refs["formData"].resetFields();
      //   this.formData = {};
      this.close();
    },
    //提交
    submitForm() {
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            this.edit();
          } else {
            this.add();
          }
        } else {
          console.log("表单验证失败");
        }
      });
    },

    //编辑
    async edit() {
      const res = await updateAdvert(this.formData);
      console.log(res);
      if (res.code == 20000) {
        this.$message({ message: "修改成功", type: "success" });
        this.handleClose();
        this.$refs["formData"].resetFields();
      } else {
        this.$message({ message: "修改失败", type: "danger" });
      }
    },
    //新增
    async add() {
      const res = await addAdvert(this.formData);
      console.log(res);
      if (res.code == 20000) {
        this.$message({ message: "新增成功", type: "success" });
        this.handleClose();
      } else {
        this.$message({ message: "新增失败", type: "danger" });
      }
    },

    //图片上传
    uploadMainImg() {},
  },
};
</script>
<style lang="scss" >
.advert {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>