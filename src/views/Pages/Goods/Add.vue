<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="active"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器区域 -->
              <!-- v-model绑定的是选中的id options是绑定的数据 -->
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="cascaderProps"
                @change="selectChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的后台api地址 -->
            <el-upload
              :action="uploadURL"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add()"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { getAllCateAPI, getAttributesAPI, addGoodsAPI } from "@/api/index";
export default {
  data() {
    return {
      // 控制默认激活的选项
      active: "0",
      // 添加商品的表单
      addForm: {
        cate_id: "",
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        // 商品所属的分类数组，此时是1id+2id+3id
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      // 表单验证规则
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请先选择商品分类", trigger: "blur" },
        ],
      },
      // 联级选择器的数据
      CateList: [],
      // 联级选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      // 控制对话框的隐藏
      previewVisible: false,
    };
  },
  created() {
    // 获取级联选择器的数据
    this.getAllCateList();
  },
  computed: {
    /* 当前选中的三级分类的Id，因为很多地方都要用到，所以先提取出来，级联选择器选中的时候就确定了 */
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
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
    // 级联选择器选中项变化，会触发这个函数
    selectChange() {
      if (this.addForm.goods_cat.length !== 3) {
        // 证明没有选中三级分类
        this.addForm.goods_cat = [];
      }
    },
    //
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.active === "1") {
        const { data: res } = await getAttributesAPI(this.cateId, "many");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.active === "2") {
        const { data: res } = await getAttributesAPI(this.cateId, "only");
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((item) => item.pic === filePath);
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的业务逻辑
        //  this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await addGoodsAPI(form);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>