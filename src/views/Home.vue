<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logow.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" round @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">—</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#29323c"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="collapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + child.path"
              v-for="child in item.children"
              :key="child.id"
            >
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menusAPI } from "@/api/index";
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 菜单的折叠与展开
      collapse: false,
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.localStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getMenuList() {
      const { data: res } = await menusAPI();
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.menulist = res.data;
      }
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  // background-color: #29323c;
  // background: linear-gradient(#29323c, #485563);
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 60px;
    }
  }
}
.el-aside {
  background-color: #29323c;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #485563;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>