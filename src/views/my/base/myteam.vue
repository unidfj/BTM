<template>
  <div class="page">
    <m-header title="我的团队" :canback="Boolean(1)"></m-header>
    <section class="body">
      <div class="blue">
        <p>团队人数</p>
        <p>{{tnum}}人</p>
      </div>
      <section class="title">
        <span v-for="e of ['下级', '团队人数', '会员等级', '注册时间']" :key="e">{{ e }}</span>
      </section>
      <!-- 列表 -->
      <section class="listbox">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="100"
        >
          <div class="listitem" v-for="(item, index) of list" :key="index">
            <span>{{ item.username }}</span>
            <span>{{ item.tdnum }}</span>
            <span>{{ item.levelname }}</span>
            <span>{{ item.createtime }}</span>
          </div>
        </van-list>
      </section>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Owner } from "@/server/server.js";
import { List } from "vant";
Vue.use(List);
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      page: 1,
      list: [],
      tnum: 0,
      finished: false,
      loading: false,
      page_rows: 10
    };
  },
  computed: {
    ...mapGetters(["uid"])
  },
  created() {},
  mounted() {
    this.getdata();
  },
  methods: {
    getdata(preid = this.uid, page = this.page) {
      this.loading = true;
      Owner.getTeam({ preid, page }).then(res => {
        console.log(res);
        // 判断还有更多
        if (res.data.code != 1) {
         mui.toast("获取数据失败,稍后重试");
          return;
        }
        this.tnum = res.data.data2.teamnum;
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
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.page {
  box-sizing: border-box;
  .body {
    background-color: @bg-color;
  }
  .blue {
    width: 690px;
    height: 178px;
    background: rgba(0, 162, 234, 1);
    border-radius: 8px;
    margin: 30px;
    padding: 20px;
    .display-flex();
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    p:nth-child(2) {
      font-size: 54px;
    }
  }
  .title {
    .display-flex();
    justify-content: space-between;
    align-items: center;
    height: 84px;
    background: #fff;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding: 0 40px 0 70px;
    border-bottom: 1px solid #f4f4f4;
  }
}
.listbox {
  overflow: auto;
  height: 100%;
}
.listitem {
  background: #fff;
  padding: 0 20px 0 20px;
  border-bottom: 1px solid #f4f4f4;
  overflow: hidden;
  height: 70px;
  line-height: 70px;
  font-size: 24px;
  color: rgba(102, 102, 102, 1);
  .display-flex();
  justify-content: space-between;
  text-align: center;
  span {
    width: 25%;
  }
}
</style>
