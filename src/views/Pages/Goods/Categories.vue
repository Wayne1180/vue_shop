<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <!-- <el-table :data="cateList" style="width: 100%" stripe border>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="width">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"> </el-table-column>
        <el-table-column prop="cat_level" label="排序"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="small" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->

      <tree-table
        class="treeTable"
        :show-index="true"
        border
        stripe
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.cateInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <!-- 修改分类对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="editVisible" width="40%"> -->
    <!-- 表单区域 -->
    <!-- <el-form
        :model="cateForm"
        :rules="cateRules"
        ref="cateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCate">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible"
      width="40%"
      @close="addCateClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="newCateForm"
        :rules="addRules"
        ref="newCateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="newCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  cateListAPI,
  getCateByIdAPI,
  doubleCateAPI,
  addCateAPI,
} from "@/api/index";
export default {
  data() {
    return {
      // 请求分类数据的params（商品分类页面初始化）
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      /* 分页器相关的数据 */
      // 分类总数（分页器需要使用）
      total: 0,

      // 商品分类的数据列表，默认为空（初始化需要用到的数据）
      cateList: [],
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],

      /* 添加分类表单相关 */
      // 添加分类对话框开关
      addVisible: false,
      // 添加分类的表单
      newCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
      },
      // 父级分类的列表（添加分类表单需要渲染出来）
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],

      // // 修改分类对话框
      // editVisible: false,
      // // 分类对话框的表单
      // cateForm: {},
      // cateRules: {},

      // // 需要提交给后台的数据
      // newCate: {
      //   cat_pid: "",
      //   cat_name: "",
      //   cat_level: "",
      // },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表（页面初始化铺设数据）
    async getCateList() {
      const { data: res } = await cateListAPI(this.cateInfo);
      //   console.log(res);
      // 把数据列表赋值给cateList
      this.cateList = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },

    /* 分页器 */
    // 每页数量改变的回调
    handleSizeChange(newPage) {
      this.cateInfo.pagesize = newPage;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.cateInfo.pagenum = newPage;
      this.getCateList();
    },

    // 弹出添加分类的对话框
    async addCate() {
      this.addVisible = true;
      // 获取父级分类的数据列表
      const { data: res } = await doubleCateAPI(2);
      this.parentCateList = res.data;
      // console.log(this.parentCateList);
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys);
      // 如果selectedKeys数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 说明选中了分类
        // 父级分类的id
        this.newCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值，等级level是从0开始的，三级分类就是2
        this.newCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 说明要添加的是一级分类
        this.newCateForm.cat_pid = 0;
        this.newCateForm.cat_level = 0;
      }
    },
    // 提交新分类的回调
    async addNewCate() {
      // console.log(this.newCateForm);
      const { data: res } = await addCateAPI(this.newCateForm);
      // console.log(res);
      this.$message.success("添加分类成功！");
      this.addVisible = false;
      this.getCateList();
    },
    // 关闭添加分类的对话框
    addCateClose() {
      this.$refs.newCateForm.resetFields();
      this.selectedKeys = [];
      this.newCateForm.cat_level = 0;
      this.newCateForm.cat_pid = 0;
    },

    /* // 弹出修改分类对话框
    async editCate(row) {
      this.editVisible = true;
      //   console.log(row);
      this.newCate.cat_pid = row.cat_pid;
      this.newCate.cat_level = row.cat_level;
      const { data: res } = await getCateByIdAPI(row.cat_id);
      this.cateForm = res.data;
      //   console.log(this.cateForm);
    }, */

    /* // 提交新的分类名称
    async submitCate() {
      this.newCate.cat_name = this.cateForm.cat_name;
      const { data: res } = await addCateAPI(this.newCate);
      console.log(res);
    }, */
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>