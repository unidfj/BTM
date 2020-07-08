<template>
  <div class="page">
    <m-header :title="title" :canback="Boolean(1)"></m-header>
    <div class="body" v-html="agreement">
    </div>
  </div>
</template>
<script>
import { Init } from "@/server/server.js";

export default {
  data() {
    return {
      title: null,
      agreement: null,
    };
  },
  created() {
    this.title = this.$route.query.type;
    this.getConfig();
  },
  methods: {
    getConfig() {
      Init.getConfig().then(res => {
        if (res.code === 1) {
          if(this.title == '注册协议') {
            this.agreement = res.data.xieyi;
          }else {
            this.agreement = res.data.yinsi;
          }
        } else {
          mui.toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  padding: @margin-primary;
  background-color: #fff;
  /deep/ p {
    color: #333;
  }
}
</style>