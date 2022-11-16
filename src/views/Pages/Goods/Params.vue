<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="只允许为第三级分类设置相关参数" type="warning" show-icon>
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span class="demonstration">请选择商品分类：</span>
          <!-- 级联选择器区域 -->
          <!-- v-model绑定的是选中的id options是绑定的数据 -->
          <el-cascader
            v-model="selectedKeys"
            :options="CateList"
            :props="cascaderProps"
            @change="selectChange"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs区域 -->
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <!-- 动态参数的Tab -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addAttr()"
            >添加参数</el-button
          >
          <!-- 表格区域 -->
          <el-table :data="manyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editAttrDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性的Tab -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isBtnDisabled"
            @click="addAttr()"
            >添加属性</el-button
          >
          <!-- 表格区域 -->
          <el-table :data="onlyTableData" stripe border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editAttrDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 对话框 -->
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 表单验证 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAttr()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单验证 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="this.activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllCateAPI,
  getAttributesAPI,
  addAttrAPI,
  searchAttrAPI,
  putAttrAPI,
  deleteAttrAPI,
} from "@/api/index";
export default {
  data() {
    return {
      // 联级选择器的数据
      CateList: [],
      // 联级选择器选定的key
      selectedKeys: [],
      // 联级选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },

      // 默认被选中的选项
      activeName: "many",

      // 分别设置两个tab的数据
      manyTableData: [],
      onlyTableData: [],

      // 添加属性的对话框
      addDialogVisible: false,
      // 添加属性的表单验证
      addForm: {},
      addRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 编辑属性的对话框
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      editRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // 控制按钮与文本框的切换显示
      // inputVisible: false,
      // 文本框中输入的内容
      // inputValue: "",
    };
  },
  created() {
    this.getAllCateList();
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    /* 当前选中的三级分类的Id，因为很多地方都要用到，所以先提取出来，级联选择器选中的时候就确定了 */
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    // 动态计算标题的文本（添加参数弹框打开的时候自动判断）
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  methods: {
    // 获取联级选择器的数据
    async getAllCateList() {
      const { data: res } = await getAllCateAPI(3);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.CateList = res.data;
      this.$message.success("获取商品分类成功");
    },

    // 获取表格需要铺设的数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 获取数据的函数需要传入id和sel（many或only）
      const { data: res } = await getAttributesAPI(
        this.cateId,
        this.activeName
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      } else {
        // 如果是many，则给many的表格数据赋值，否则是only
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
        // 此时获取到的是所有列的数据
        res.data.forEach((item) => {
          // 获取到的attr_vals是一个很长的字符，此时需要切割成一个数组，然后for循环渲染出来
          // 此时每一项的数据都在自己身上（manyTableData中的每一项上），所以不用保存到data里，渲染的时候直接使用scope.row
          // 如果item.attr_vals为空数组，不处理的话会渲染出来一个空的tag
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 先把每一项的文本框和输入的值都隐藏清空
          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框中输入的值
          item.inputValue = "";
        });
      }
    },

    // 级联选择器中选中后的函数
    selectChange() {
      this.getParamsData();
    },
    // 切换tab的回调函数
    tabChange() {
      this.getParamsData();
    },

    // 编辑属性的回调
    /* 
      点击编辑属性，会先向服务器发送请求，获取此参数的名称，在input框中显示出来
      需要携带的参数：选中的三级分类ID（此前已经保存在计算属性中，这一行的id，还有激活的tab名称）
      获取到信息后，把数据绑定到input中，同时把编辑属性的弹框打开
    */
    async editAttrDialog(attr_id) {
      const { data: res } = await searchAttrAPI(
        this.cateId,
        attr_id,
        this.activeName
      );
      if (res.meta.status !== 200) {
        this.$message.error(`获取${this.titleText}失败`);
      }
      // 获取到的data中，有此行的id，此行的参数名称（attr_name），此行的tag数据，还有三级分类id
      this.editForm = res.data;
      this.$message.success(`获取${this.titleText}成功`);
      this.editDialogVisible = true;
    },
    // 点击按钮，提交修改参数信息
    async editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
      });
      const { data: res } = await putAttrAPI(
        this.cateId,
        this.editForm.attr_id,
        this.editForm.attr_name,
        this.activeName
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      }
      this.$message.success("修改参数成功");
      // 获取最新的数据
      this.getParamsData();
      this.editDialogVisible = false;
    },
    // 编辑弹窗关闭的函数
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 删除按钮的函数（删除一大行参数）
    removeParams(attr_id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await deleteAttrAPI(this.cateId, attr_id);
          if (res.meta.status !== 200) {
            this.$message.error("删除失败");
          }
          this.getParamsData();
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

    // 添加属性的对话框弹出
    addAttr() {
      this.addDialogVisible = true;
    },
    // 添加属性对话框关闭的回调
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定按钮的回调
    submitAttr() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await addAttrAPI(
          this.cateId,
          this.addForm.attr_name,
          this.activeName
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        // 重新获取table的数据
        this.getParamsData();
      });
    },

    // 文本框失去焦点，或摁下了enter都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入的内容，需要做进一步的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row);
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
    // 将对attr_vals的操作，保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await putAttrAPI(
        this.cateId,
        row.attr_id,
        row.attr_name,
        row.attr_sel,
        row.attr_vals.join(" ")
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }
      this.$message.success("修改参数项成功！");
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
