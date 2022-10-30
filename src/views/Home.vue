<template>
  <div>
    <el-button type="primary" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
  },
};
</script>

<style>
</style>