<template>
  <!-- 转账记录 -->
  <div class="page">
    <m-header title="转账记录" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div class="tab">
        <span v-for="(e,i) of tab" :key="i">{{e}}</span>
      </div>
      <div class="listbox">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="- -没有更多了- -"
          @load="onLoad"
          :offset="100"
        >
          <div class="tabitem" v-for="(item,index) of list" :key="index">
            <span>{{item.conetent}}</span>
            <span>{{item.money}}</span>
            <span>{{item.createtime}}</span>
          </div>
        </van-list>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Owner } from "@/server/server.js";
import { List } from "vant";

Vue.use(List);
export default {
  data() {
    return {
      loading: false,
      finished: false,
      tab: ["说明", "数量", "时间"],
      list: [],
      page: 1,
      page_rows: 20
    };
  },

  methods: {
    getdata() {
      this.loading = true;
      Owner.gettransferlist({
        page: this.page,
        page_rows: this.page_rows
      }).then(res => {
        console.log(res.data.data);
        if (res.data.code !== 1) {
          mui.toast("获取数据失败,稍后重试");
          return;
        }
        // 判断还有更多
        res.data.data.length < this.page_rows
          ? (this.finished = true)
          : this.page++;
        this.list = [
          ...this.list,
          ...res.data.data.map(v => {
            return { ...v, createtime: v.createtime.split(" ")[0] };
          })
        ];
        this.loading = false;
      });
    },
    onLoad() {
      this.getData();
    }
  },
  mounted() {
    this.getdata();
  }
};
</script>

<style lang="less" scoped>
@import "~link-less";
.page {
  box-sizing: border-box;
  background: #fff;
  text-align: center;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 80px 0 100px;
  border-bottom: 1px solid #f4f4f4;
}
.listbox {
  overflow: auto;
  height: 100%;
}
.tabitem {
  margin: 0 30px 0 40px;
  border-bottom: 1px solid #f4f4f4;
  overflow: hidden;
  display: flex;
  line-height: 50px;
  justify-content: space-between;
  align-items: center;
  span:nth-child(1) {
    max-width: 22%;
  }
  //   span:nth-last-child(1) {
  //     color: #ff3b30;
  //   }
}
</style>

