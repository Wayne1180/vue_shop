<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="Params.query"
            @clear="getOrdersList"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersList" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="editOrder(scope.row)"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-truck"
              @click="showProgressBox"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="Params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框区域 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editVisible"
      width="50%"
      @close="editClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="editForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- Timeline -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/views/Pages/Orders/citydata";
import { getOrdersListAPI, getKuaidiAPI } from "@/api/index";
export default {
  data() {
    return {
      Params: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      // 订单列表数据
      ordersList: [],
      total: 0,
      // 编辑对话框
      editVisible: false,
      editForm: {
        address1: [],
        address2: "",
      },
      editRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      citydata,
      progressVisible: false,
      progressInfo: [],
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const { data: res } = await getOrdersListAPI(this.Params);
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页器每页显示内容数量的函数
    handleSizeChange(newPagesize) {
      this.Params.pagesize = newPagesize;
      this.getOrdersList();
    },
    // 分页器页数变化的函数
    handleCurrentChange(newPage) {
      this.Params.pagenum = newPage;
      this.getOrdersList();
    },
    // 点击编辑按钮
    editOrder(row) {
      console.log(row);
      this.editVisible = true;
    },
    editClose() {
      this.$refs.editFormRef.resetFields();
    },
    async showProgressBox() {
      this.progressVisible = true;
      const { data: res } = await getKuaidiAPI();
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流进度失败！");
      }
      this.progressInfo = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>