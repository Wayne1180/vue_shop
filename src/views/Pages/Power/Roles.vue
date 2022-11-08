<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addRole"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- v-for，有多少一级权限就渲染出多少“行” -->
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope, item1)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 右边是二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限，有多少个二级权限就渲染多少行 -->
                <el-row
                  :class="[index === 0 ? '' : 'bdtop ', 'vcenter']"
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限的位置 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope, item2)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限的位置 -->
                  <el-col :span="18">
                    <!-- 渲染三级权限，此时不需要换行 -->
                    <el-tag
                      type="warning"
                      v-for="(item3, index) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope, item3)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹框部分 -->
    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      width="40%"
      @close="addRoleClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="addRoleForm"
        :rules="addRules"
        ref="addRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog
      title="提示"
      :visible.sync="editRoleDialog"
      width="30%"
      @close="editRoleClose"
    >
      <!-- 表单区域 -->
      <el-form
        ref="editRoleForm"
        :model="editRoleForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="ID" prop="roleId">
          <el-input v-model="editRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="allotDialog"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形结构 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  rolesListAPI,
  deleteRightAPI,
  addRoleAPI,
  roleDataAPI,
  roleEditAPI,
  roleDeleteAPI,
  rightsTreeAPI,
  allotRightsAPI,
} from "@/api/index";
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 添加角色弹框
      addRoleDialog: false,
      // 添加角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表单验证
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      /* 修改角色表单相关 */
      // 修改角色弹框
      editRoleDialog: false,
      // 修改角色表单
      editRoleForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      // 修改角色表单验证
      editRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      /* 分配权限相关 */
      // 控制分配权限对话框的显示与隐藏
      allotDialog: false,
      // 所有权限的数据
      rightsList: [],
      // 树形数据
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 表单需要的用户id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await rolesListAPI();
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    // 根据id删除对应的权限
    removeRightById(scope, item3) {
      // 弹框提示用户是否要删除
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // console.log(scope.row.id, item3.id);
          const { id: roleId } = scope.row;
          const { id: perId } = item3;
          const { data: res } = await deleteRightAPI(roleId, perId);
          if (res.meta.status !== 200) {
            return this.$message.error("删除权限失败！");
          }
          // this.getRolesList();
          // 防止重新加载
          role.children = res.data;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 添加角色表单相关 */
    // 添加角色
    addRole() {
      this.addRoleDialog = true;
    },
    // 提交表单
    submitAddForm() {
      this.$refs.addRoleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await addRoleAPI(this.addRoleForm);
          if (res.meta.status !== 201) {
            this.$message.error("添加失败");
          } else {
            this.addRoleDialog = false;
            this.getRolesList();
            this.$message.success("添加成功");
          }
        } else {
          this.$message.error("信息不合法");
        }
      });
    },
    // 关闭对话框的回调
    addRoleClose() {
      this.$refs.addRoleForm.resetFields();
    },
    /* 修改角色相关 */
    // 弹出对话框
    async editRole(row) {
      // 根据id获取角色信息
      const { data: res } = await roleDataAPI(row.id);
      // 将角色信息进行双向绑定
      this.editRoleForm = res.data;
      // 打开编辑对话框
      this.editRoleDialog = true;
    },
    // 提交信息的回调
    submitEditForm() {
      this.$refs.editRoleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await roleEditAPI(
            this.editRoleForm.roleId,
            this.editRoleForm
          );
          if (res.meta.status !== 200) {
            this.$message.error("修改失败");
          } else {
            this.editRoleDialog = false;
            this.getRolesList();
            this.$message.success("修改成功");
          }
        } else {
          this.$message.error("信息不合法");
        }
      });
    },
    // 关闭对话框的回调
    editRoleClose() {
      this.$refs.editRoleForm.resetFields();
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await roleDeleteAPI(row.id);
          if (res.meta.status !== 200) {
            this.$message.error("删除失败");
          }
          this.getRolesList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 先为表单保存好id
      this.roleId = role.id;
      const { data: res } = await rightsTreeAPI();
      // 获取到的权限数据保存到data中
      this.rightsList = res.data;
      // console.log(this.rightsList);

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys);

      this.allotDialog = true;
    },
    // 通过递归的方式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 如果不清空，下次点击分配角色的时候会覆盖上去，出现错误
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await allotRightsAPI(this.roleId, idStr);
      if (res.meta.status !== 200) {
        this.$message.error("更新失败");
      } else {
        this.$message.success("更新成功");
        this.allotDialog = false;
        this.getRolesList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>