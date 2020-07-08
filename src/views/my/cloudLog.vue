<template>
  <div class="page">
    <m-header title="云仓存货记录" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="wrap"        :style="'height:'+(screenHeight-40)+'px;overflow:auto;'"
        v-lazy-load="lazyLoad">
        <li class="list">
          <span class="name">说明</span>
          <span class="name">数量</span>
          <span class="name">时间</span>
        </li>
        <li class="list" v-for="(item, idx) in goodsList" :key="idx">
          <span>{{item.remark}}</span>
          <span>{{item.cloud_num}}</span>
          <span>{{item.createtime}}</span>
        </li>
        <next ref="next" :nomore="noMore"></next>
      </ul>
    </div>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import { Load } from "@/assets/commonjs/utils.js";

export default {
  data() {
    return {
      page: 1,
      goodsList: [],
      screenHeight: 667,
      noMore: false
    };
  },
  created() {
    this.screenHeight = window.screen.height || window.screen.availHeight;
    console.log(window.screen)
    
  },
  mounted() {
    this.stockLog();
  },
  methods: {
    stockLog() {
      Load.loadNext(this);
      Owner.stockLog({ page: this.page, page_rows: 10 }).then(res => {
        if (res.code === 1) {
          this.goodsList = this.goodsList.concat(res.data);
          if (res.page >= res.totalpage) {
            this.noMore = true;
          }
        } else {
          mui.toast(res.msg);
        }
      });
    },
    lazyLoad() {
      this.page = this.page + 1;
      if (!this.noMore) {
        this.stockLog();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  //   padding: @margin-primary;
  background-color: @bg-color;
  .wrap {
      
    .list {
      .display-flex();
      justify-content: space-between;
      font-size: 24px;
      background: #fff;
      border-bottom: 1px solid #eee;
      color: #666;
      .name {
        color: #333;
        font-size: 28px;
      }
      >span {
          flex: 1;
          padding: 15px;
          text-align: center;
          &:first-child {
              word-break: break-all;
          }
      }
    }
  }
}
</style>