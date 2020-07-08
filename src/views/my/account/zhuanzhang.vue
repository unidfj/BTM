<template>
  <div class="page">
    <div class="header">
      <m-header title="我的转账" :canback="Boolean(1)"></m-header>
      <span @click="() => {this.$router.push({ name: 'zhuanzhangjilu' })}">转账记录</span>
    </div>
    <section class="body">
      <!-- 币种类型 -->
      <div class="box">
        <div class="boxtype">币种类型</div>
        <div class="boxvalue" @click="() => {this.picker.show = true;}">
          {{ picker.columnsPicker }}
          <img
            class="arrowicon"
            src="../../../assets/images/btm/ico_xl.png"
          />
        </div>
        <van-popup v-model="picker.show" position="bottom" :close-on-click-overlay="false">
          <van-picker
            show-toolbar
            :columns="picker.columns"
            title="币种类型"
            @cancel="onCancel"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
      <!-- 转账金额 -->

      <div class="box">
        <div class="boxtype">转账金额</div>
        <input class="boxvalue" type="number" placeholder="请输入转账数量" v-model="form.money" />
      </div>

      <!-- 手机号码 -->
      <div class="box">
        <div class="boxtype">手机号码</div>
        <input class="boxvalue" type="number" placeholder="请输入目标会员手机号" v-model="form.mobile" />
      </div>
      <!-- 确认充值 -->
      <button class="surebtn" @click="() => {this.$refs.pwd.open()}" :disabled="disabled">确认转账</button>
      <Pwdalert ref="pwd" @pay="pay" />
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Picker, Popup } from "vant";
import Pwdalert from "@/components/pwd-alert";
Vue.use(Picker);
Vue.use(Popup);
import { Owner } from "@/server/server.js";
export default {
  components: { Pwdalert },
  data() {
    return {
      disabled: false,
      picker: {
        show: false,
        columns: ["商城余额", "消费金", "股权"],
        columnsPicker: ""
      },
      form: {
        mobile: null,
        paypwd: null,
        money: null,
        type: null
      }
    };
  },
  methods: {
    pay(e) {
      // 支付
      this.form.paypwd = e;
      this.disabled = true;
      Owner.gettransfermoney(this.form).then(res => {
        console.log(res);
        if (res.data.code == 1) {
          mui.toast(res.data.msg);
          setTimeout(() => {
            this.$router.push({ name: "zhuanzhangjilu" });
          }, 1500);
        } else mui.toast(res.data.msg);
      });
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
    onCancel(e) {
      this.picker.show = false;
    },
    onConfirm(e) {
      this.picker.columnsPicker = e;
      if (e == "商城余额") this.form.type = 1;
      if (e == "消费金") this.form.type = 2;
      if (e == "股权") this.form.type = 3;
      this.picker.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~link-less";
.page {
  box-sizing: border-box;
}
.header {
  position: relative;
  span {
    z-index: 99;
    position: absolute;
    right: 30px;
    top: 20px;
    font-size: 26px;
    color: rgba(0, 162, 234, 1);
  }
}
.box {
  width: 100%;
  height: 96px;
  line-height: 96px;
  padding: 0 30px;
  font-size: 28px;
  display: flex;
  color: #666666;
  border-bottom: 1px solid #f4f4f4;
  background: #fff;
  .boxtype {
    width: 130px;
    flex-shrink: 0;
    font-size: 32px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-right: 20px;
    white-space: nowrap;
  }
  .boxvalue {
    flex: 1;
    position: relative;
  }
  .arrowicon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    width: 30px;
    height: 30px;
  }
}
.surebtn {
 	margin: 20% 75px;
  width: 600px;
  height: 88px;
  background: rgba(0, 162, 234, 1);
  line-height: 88px;
  text-align: center;
  color: #fff;
  font-size: 34px;
  border-radius: 44px;
}
</style>
