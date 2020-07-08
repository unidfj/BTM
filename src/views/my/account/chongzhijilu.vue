<template>
  <!-- 提现记录 -->
  <div class="page">
    <m-header title="充值记录" :canback="Boolean(1)"></m-header>
    <section class="body">
      <!-- <div class="tab">
        <span v-for="(e, i) of tab" :key="i">{{ e }}</span>
      </div> -->
      <div class="listbox" :style="'height:'+(screenHeight-40)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <!-- <van-list
          v-model="loading"
          :finished="finished"
          finished-text="- -没有更多了- -"
          @load="onLoad"
          :offset="100"
        > -->
          <div class="tabitem" v-for="(item, index) of list" :key="index" >
            <div class="list">
              <span>说明:{{item.content}}</span>
              <span>时间：{{item.createtime}}</span>
            </div>
            <div class="list">
              <span>数量：{{item.money}}</span>
              <span class="status">状态：{{item.statustext}}</span>
            </div>
            <div class="list">
              <span class="reason" v-if='item.comment'>理由：{{item.comment}}</span>
            </div>

            <!-- <span>{{ item.moneytype }}</span>
            <span>{{ item.createtime }}</span>
            <span>{{ item.money }}</span>
            <span>{{ item.state }}</span>
            <span class="status">{{ item.status }}</span> -->
          </div>
          <next ref="next" :nomore="noMore"></next>

        <!-- </van-list> -->
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Owner } from "@/server/server.js";
import { List } from "vant";
import { Util,Load } from "@/assets/commonjs/utils.js";
Vue.use(List);
export default {
  data() {
    return {
      loading: false,
      finished: false,
      tab2: ["说明", "时间", "数量", "状态","理由"],
      list: [],
      page: 1,
      page_rows: 20,
      screenHeight: 667,
      noMore: false,
    };
  },
  created () {
    this.screenHeight = window.screen.height || window.screen.availHeight;
  },
  methods: {
    getrechargeHistory() {
      // this.loading = true;
      Load.loadNext(this);
      Owner.getrechargeHistory({
        page: this.page,
        page_rows: this.page_rows,
      }).then((res) => {
        if (res.data.code == 1) {
          if(res.data.page>=res.data.totalpage) {
            this.noMore = true;
          }
          this.list = [
            ...this.list,
            ...res.data.data.map((v) => {
              return { ...v };
            }),
          ];
        }else {
          mui.toast(res.msg)
        }
        // 判断还有更多
        // res.data.data.length < this.page_rows
        //   ? (this.finished = true)
        //   : this.page++;

        // this.loading = false;
      });
    },
    lazyLoad() {
      this.page = this.page + 1;
      if (!this.noMore) {
        this.getrechargeHistory();
      }
    },
    onLoad() {
      this.getrechargeHistory();
    },
  },
  mounted() {
    this.getrechargeHistory();
  },
};
</script>

<style lang="less" scoped>
@import "~link-less";
.page {
  // box-sizing: border-box;
  background: #fff;
  // white-space: nowrap;
  // text-align: center;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 50px;
  border-bottom: 1px solid #f4f4f4;
  span:nth-child(2) {
    min-width: 80px;
  }
}
.listbox {
  overflow: auto;
  height: 100%;
}
.tabitem {
  // margin: 0 30px 0 40px;
  padding: 20px;
  border-bottom: 1px solid #f4f4f4;
  // overflow: hidden;
  // white-space: nowrap;
  // height: 84px;
  // line-height: 84px;
  // display: flex;
  // justify-content: space-between;
  // span:nth-child(2) {
  //   min-width: 140px;
  // }
  // span:nth-last-child(1) {
  //   color: #ff3b30;
  // }
  .list {
    .display-flex();
    justify-content: space-between;
    .status {
      color: #ff3b30;
    }
    .reason {
      word-break: break-all;
    }
  }
}
</style>
