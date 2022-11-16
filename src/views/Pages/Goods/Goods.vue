<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- gutter用于控制col之间的间隔 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="Params.query"
            @clear="getGoodsList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="GoodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 编辑区域 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Params.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="Params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框区域 -->
    <!-- 编辑商品的对话框 -->
    <el-dialog title="提示" :visible.sync="editVisible" width="30%">
      <!-- 表单验证区域 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsInfoAPI,
  getGoodsAPI,
  putGoodsAPI,
  deleteGoodsAPI,
} from "@/api/index";
export default {
  data() {
    return {
      // 向服务器发起请求获取商品列表所需要提交的数据
      Params: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 获取商品列表
      GoodsList: [],
      // 分页器相关的数据
      total: 0,
      /* 对话框相关 */
      // 控制编辑对话框的显示与隐藏
      editVisible: false,
      // 编辑对话框绑定的数据
      editForm: {},
      // 编辑对话框绑定的验证规则
      editRules: {},
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await getGoodsInfoAPI(this.Params);
      this.total = res.data.total;
      // 将创建时间的时间戳改为正常的时间
      // res.data.goods.forEach((item) => {
      //   item.add_time = new Date(item.add_time);
      // });
      this.GoodsList = res.data.goods;
    },
    /* 分页器相关的函数 */
    // 切换每页显示的内容的函数
    handleSizeChange(newPage) {
      this.Params.pagesize = newPage;
      this.getGoodsList();
    },
    // 切换页码的函数
    handleCurrentChange(newPage) {
      this.Params.pagenum = newPage;
      this.getGoodsList();
    },
    // 弹出编辑商品的对话框
    async showEditDialog(row) {
      this.editVisible = true;
      const { goods_id: id } = row;
      const { data: res } = await getGoodsAPI(id);
      this.editForm = res.data;
    },
    // 编辑提交商品
    async subEdit() {
      const { data: res } = await putGoodsAPI(
        this.editForm.goods_id,
        this.editForm
      );
      console.log(res);
    },
    deleteGoods(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await deleteGoodsAPI(row.goods_id);
          console.log(res);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getGoodsList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style>
</style>