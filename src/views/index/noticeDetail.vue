<template>
  <div class="page">
    <m-header title="公告详情" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div v-for="item of list" :key="item.id">
        <div class="wrap">
          <div class="title">{{item.title}}</div>
          <div class="date">发布时间：{{item.createtime}}</div>
        </div>
        <div class="new-con" v-html="item.contents"></div>
      </div>
    </section>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
export default {
  data() {
    return {
      id:null,
      list: []
    };
  },
  mounted() {
    this.initData();
    let id = this.id;
    this.getNoticeDetail(id);
  },
  methods: {
    initData(){
      this.id = this.$route.params.id;
    },
    /**
     * 公告详情
     */
    getNoticeDetail(id) {
      Owner.getNoticeDetail({id}).then(res => {
        if (res.code == 1) {
          this.list = res.data;
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
  height: 100%;
  background:#fff;
  .wrap {
    margin: 30px 30px 0;
    color: #333;
    .title{
      font-size: 39px;
      text-align: center;
    }
    .date {
      padding: 8px 0;
      font-size: 24px;
      color: #999;
      text-align: center;
    }
  }
  .new-con {
    margin: 10px 30px ;
    font-size: 28px;
    color: white;
    /deep/ p {
      color: #666;
    }
    /deep/ img {
      width: 100%;
    }
  }
}
</style>
