<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="editRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 对话框区域 -->
    <!-- “添加用户”对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="35%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- “修改用户信息”对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editVisible"
      width="35%"
      @close="editDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRoleDialog"
      width="40%"
      @close="clearOption"
    >
      <!-- 描述列表 -->
      <el-descriptions :column="1">
        <el-descriptions-item label="当前的用户">{{
          allotInfo.username
        }}</el-descriptions-item>
        <el-descriptions-item label="当前的角色">{{
          allotInfo.role_name
        }}</el-descriptions-item>
      </el-descriptions>
      <!-- 选择器 -->
      <!-- {{ allotSelect }} -->
      <template>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in allotSelect"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userListAPI,
  userEditAPI,
  addUserAPI,
  editUserAPI,
  saveUserAPI,
  deleteUserAPI,
  allotRoleAPI,
  roleRightAPI,
} from "@/api/index";
export default {
  data() {
    // 验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regPhone =
        /^(0|86|7951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      input: "",
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      // 用户列表
      userlist: [],
      total: 0,

      /* 添加用户对话框相关 */
      // 控制添加用户对话框开启或关闭
      dialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "请输入正确的密码",
            trigger: ["blur", "change"],
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },

      /* 修改用户信息对话框相关 */
      // 控制修改用户信息对话框
      editVisible: false,
      // editForm: {
      //   id: "",
      //   username: "",
      //   email: "",
      //   mobile: "",
      // },
      editForm: {},
      editRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },

      /* 分配角色的对话框 */
      allotRoleDialog: false,
      // 分配角色对话框
      allotInfo: {},
      // 分配角色选择器数据
      allotSelect: [],
      value: "",
      rowId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await userListAPI(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      } else {
        this.userlist = res.data.users.reverse();
        this.total = res.data.total;
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关状态的改变
    async userStateChanged(userinfo) {
      const { data: res } = await userEditAPI(userinfo);
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },

    /* 添加用户对话框相关 */
    // 表单提交的回调
    submitForm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await addUserAPI(this.addForm);
          if (res.meta.status !== 201) {
            this.$message.error("添加失败");
          } else {
            this.dialogVisible = false;
            this.getUserList();
            this.$message.success("添加成功");
          }
        } else {
          this.$message.error("信息不合法");
        }
      });
    },
    // 表单取消的回调
    addDialogClosed() {
      this.$refs.addForm.resetFields();
      // this.dialogVisible = false;
    },

    /* 修改用户对话框相关 */
    // 修改用户信息的回调
    async showEditDialog(scope) {
      const { id } = scope.row;
      const { data: res } = await editUserAPI(id);
      // this.editForm.id = res.data.id;
      // this.editForm.username = res.data.username;
      // this.editForm.email = res.data.email;
      // this.editForm.mobile = res.data.mobile;
      this.editForm = res.data;
      this.editVisible = true;
    },
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    // 保存用户信息的回调
    saveUserInfo() {
      this.$refs.editForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await saveUserAPI(this.editForm);
          if (res.meta.status != 200) {
            this.$message.error("修改失败");
          } else {
            this.$message.success("修改成功");
            this.getUserList();
            this.editVisible = false;
          }
        } else {
          this.$message.error("信息不合法");
        }
      });
    },

    // 删除用户
    deleteUser(id) {
      // console.log(id);
      //
      // console.log(res);
      //
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await deleteUserAPI(id);
          if (res.meta.status != 200) {
            this.$message.error("删除失败");
          } else {
            this.$message.success("删除成功");
            this.getUserList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色相关
    async editRole(row) {
      this.allotRoleDialog = true;
      // console.log(row);
      this.allotInfo = row;
      this.rowId = row.id;
      const { data: res } = await allotRoleAPI();
      this.allotSelect = res.data;
      // console.log(this.allotSelect);
    },
    // 提交修改后的角色
    async submitRole() {
      // console.log(this.value);
      // 发送请求
      if (!this.value) {
        return this.$message.error("请选择要分配的角色");
      } else {
        const { data: res } = await roleRightAPI(this.rowId, this.value);
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("更新失败");
        } else {
          this.$message.success("更新成功");
          this.allotRoleDialog = false;
          this.value = "";
          this.getUserList();
        }
      }
    },
    clearOption() {
      this.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
</style>