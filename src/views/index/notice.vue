<template>
  <div class="page">
    <m-header title="公告信息" :canback="Boolean(1)"></m-header>
    <div class="body">
      <van-cell-group>
        <van-cell v-for="(e,i) of list" :key="i" :title="e.title" @click="goto(e.id)" is-link/>
      </van-cell-group>
    </div>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import Vue from "vue";
import { Cell, CellGroup } from "vant";
Vue.use(Cell);
Vue.use(CellGroup);
export default {
  data() {
    return {
      list: [],
      type: "mh"
    };
  },
  mounted() {
    this.initData();
    let noticeParams = {
      type: this.type,
      page: 1
    };
    this.getNotice(noticeParams);
  },
  methods: {
    initData() {
      this.type = this.$route.query.type;
    },
    // 公告list
    getNotice(params) {
      Owner.getTitle({ type: "mh" }).then(res => {
        if (res.code == 1) {
          this.list = res.data;
          console.log(this.list);
        } else {
          mui.toast(res.msg);
        }
      });
    },
    // 查看公告详情
    goto(id) {
      this.$router.push({ name: "NoticeDetail", params: { id } });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background: @bg-color;
  // padding: @padding-primary;
  // background-color: white;
  height: 100%;
  .list {
    .item {
      padding: 12px 0;
      border-bottom: 1px solid white;
      color: white;
    }
  }
}
</style>
