<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <!-- <el-card> -->
    <!-- 用户列表区域 -->
    <el-table :data="rightsList" border stripe style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-card> -->
  </div>
</template>

<script>
import { rightsListAPI } from "@/api/index";
export default {
  data() {
    return {
      rightsList: [],
      // authName: "",
      // id: "",
      // path: "",
      // pid: "",
    };
  },
  created() {
    // 获取所有的权限
    this.getRightsList();
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await rightsListAPI();
      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      } else {
        this.rightsList = res.data;
        // console.log(this.rightsList);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>