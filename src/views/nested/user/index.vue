<template>
  <div class="user">
    <el-form
      :inline="true"
      :model="searchMap"
      ref="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="searchMap.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="searchMap.mobile" size="mini"></el-input>
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
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" row-key="name">
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column align="center" label="用户名" prop="username">
        </el-table-column>
        <el-table-column align="center" label="昵称" prop="nickName">
        </el-table-column>
        <el-table-column align="center" label="手机号" prop="mobile">
        </el-table-column>
        <el-table-column align="center" label="邮箱" prop="email">
        </el-table-column>
        <el-table-column align="center" label="账号过期">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isAccountNonExpired ? 'success' : 'danger'"
              >{{ scope.row.isAccountNonExpired ? "正常" : "过期" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号锁定">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isAccountNonLocked ? 'success' : 'danger'"
              >{{ scope.row.isAccountNonLocked ? "正常" : "锁定" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="密码过期">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isCredentialsNonExpired ? 'success' : 'danger'"
              >{{ scope.row.isCredentialsNonExpired ? "正常" : "过期" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否可用">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isAccountNonExpired ? 'success' : 'danger'"
              >{{ scope.row.isAccountNonExpired ? "可用" : "已删除" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="300">
          <template slot-scope="scope">
            <div v-show="scope.row.isAccountNonExpired">
              <el-button size="mini" type="success" @click="edit(scope.row.id)"
                >编辑</el-button
              >
              <el-button size="mini" type="danger" @click="remove(scope.row.id)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="getRole(scope.row.id)"
                >设置角色</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="showUpdatePass(scope.row.id)"
                >密码修改</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
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
    </el-form>
    <!-- 编辑新增弹框 -->
    <UserEdit
      :title="editData.title"
      :id="editData.id"
      :showEdit="editData.show"
      :close="closeEdit"
    ></UserEdit>
    <!-- 修改密码弹框 -->
    <el-dialog title="修改密码" :visible.sync="showPass" width="24%">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="新密码:" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updatePassSubmnit()" size="mini"
            >提交</el-button
          >
          <el-button @click="showPass = false" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 设置角色 -->
    <el-dialog title="设置角色" :visible.sync="dialogTableVisible" width="60%">
      <!-- 表单 -->
      <el-form
        :inline="true"
        :model="roleSearch"
        ref="roleForm"
        class="demo-form-inline"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleSearch.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="searchUserRole"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetRole"
            >重置</el-button
          >
          <el-button
            size="mini"
            type="success"
            icon="el-icon-circle-plus-outline"
            @click="saveRole"
            >设置角色</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :data="gridData" border ref="dataTable">
        <el-table-column type="selection" align="center" width="60">
        </el-table-column>
        <el-table-column
          prop="id"
          label="序号"
          width="60"
          align="center"
          reserve-selection
        ></el-table-column>
        <el-table-column
          prop="name"
          label="角色信息"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          align="center"
          label="备注"
        ></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleRoleSizeChange"
        @current-change="handleRoleCurrentChange"
        :current-page="rolePage.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rolePage.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="rolePage.total"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  getUserMenuList,
  deleteById,
  updatePassword,
  getRoleIdsByUserId,
  getRoleList,
  saveUserRole,
} from "../../../api/nestedUser";
import UserEdit from "../../../components/edit/userEdit";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //搜索
      searchMap: {},
      //分页
      page: {
        current: 1,
        size: 20,
        total: 0,
      },
      //表格
      tableData: [],
      //编辑弹框组件
      editData: {
        show: false,
        title: "",
        id: 0,
      },
      //修改密码弹框数据
      showPass: false,
      ruleForm: {
        userId: 0,
        pass: "",
        checkPass: "",
      },
      rules: {
        //密码验证
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
      //设置角色弹框数据
      dialogTableVisible: false,
      roleSearch: {},
      gridData: [],
      rolePage: {
        current: 1,
        size: 20,
        total: 0,
      },
      roleIds: [],
      userId: 0,
    };
  },
  components: {
    UserEdit,
  },
  created() {
    this.getList();
  },
  methods: {
    //获取用户列表数据
    async getList() {
      const res = await getUserList(
        this.searchMap,
        this.page.current,
        this.page.size
      );
      this.tableData = res.data.records;
      this.page.total = res.data.total;
    },

    handleSizeChange(val) {
      this.page.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getList();
    },
    //查询用户列表
    search() {
      this.getList();
    },
    //新增
    add() {
      this.editData.show = true;
      this.editData.title = "新增";
    },
    //编辑
    edit(id) {
      this.editData.show = true;
      this.editData.id = id;
      this.editData.title = "编辑";
    },
    //重置
    reset() {
      this.$refs["formInline"].resetFields();
    },
    //删除
    remove(id) {
      this.$confirm("确定要删除这条记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deleteById(id);
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
    //关闭弹框
    closeEdit() {
      this.editData.show = false;
      this.getList();
    },
    //修改密码弹框
    showUpdatePass(id) {
      this.ruleForm.userId = id;
      this.showPass = true;
    },
    //提交修改密码
    async updatePassSubmnit() {
      const res = await updatePassword(this.ruleForm);
      console.log(res);
      if ((res.code = 20000)) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.showPass = false;
      } else {
        this.$message({
          message: "修改失败",
          type: "error",
        });
      }
    },
    //用户角色列表重置
    resetRole() {
      this.$refs["roleForm"].resetFields();
    },

    //用户角色列表数据获取
    async getUserRoleList() {
      const res = await getRoleList(
        this.roleSearch,
        this.rolePage.current,
        this.rolePage.size
      );
      if (res.code == 20000) {
        this.rolePage.total = res.data.total;
        this.gridData = res.data.records;
        //列表有数据后，根据用户拥有的角色id字符串勾选
        this.chekedRoles();
      }
    },

    //用户角色列表搜索
    searchUserRole() {
      this.getUserRoleList();
    },

    handleRoleSizeChange(val) {
      this.page.size = val;
      this.getRole();
    },
    handleRoleCurrentChange(val) {
      this.page.current = val;
      this.getRole();
    },
    //获取角色列表
    async getRole(id) {
      //显示弹出框
      this.dialogTableVisible = true;
      //保存用户id
      this.userId = id;
      //获取用户拥有的角色id字符串
      const result = await getRoleIdsByUserId(id);
      if (result.code == 20000) {
        this.roleIds = result.data;
      }

      //用户角色列表数据获取
      this.getUserRoleList();
    },
    // 默认勾选角色
    chekedRoles() {
      // 强调：在el-table组件中一定要加上 ref="dataTable"
      // 清空上一次选择
      this.$refs.dataTable.clearSelection();
      if (this.roleIds) {
        // 循环出查询到每个角色数据，要进行判断父组件组件的roleIds中的每个角色对象
        this.gridData.forEach((item) => {
          // 匹配到了，则应该选中
          if (this.roleIds.indexOf(item.id) !== -1) {
            // 选中，对应传递的是角色对象
            //toggleRowSelection(row,selected)
            //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，
            //则是设置这一行选中与否（selected 为 true 则选中）

            this.$refs.dataTable.toggleRowSelection(item, true);
          }
        });
      }
    },
    //保存用户拥有角色
    async saveRole() {
      const res = await saveUserRole(this.userId, this.roleIds);
      if (res.code == 20000) {
        this.$message({
          message: "新增成功",
          type: "success",
        });
        this.dialogTableVisible = false;
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
<style  scoped>
.user {
  padding: 20px;
}
</style>