<template>
  <div class="page">
    <m-header title="找回密码" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="wrap">
        <li class="list">
          <span class="label">手机号码</span>
          <input type="number" class="inp" placeholder="请输入手机号码" v-model="formData.mobile"/>
        </li>
        <li class="list">
          <span class="label">登录密码</span>
          <input type="password" class="inp" placeholder="6到15位数字加字母组合" v-model="formData.newpassword"/>
        </li>
        <li class="list">
          <span class="label">确认密码</span>
          <input type="password" class="inp" placeholder="请再次输入登录密码" v-model="formData.renewpassword"/>
        </li>
        <li class="list">
          <span class="label">验证码</span>
          <div class="code-wrap inp">
            <input
              type="number"
              class="code-inp"
              placeholder="请输入验证码"
              v-model="formData.captcha"
              maxlength="4"
            />
            <button
              type="button"
              class="code-btn"
              :disabled="seconds>0"
              @click="sendCode()"
            >{{seconds==0?"点击发送":"已发送("+seconds+"s)"}}</button>
          </div>
        </li>
      </ul>
      <button class="btn" @click="confirm">确认修改</button>
    </div>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import Vue from "vue";
import { Init,Base } from "@/server/server.js";
import {Util,Load} from '@/assets/commonjs/utils.js';
export default {
  data() {
    return {
      seconds: 0,
      formData: {
        mobile: null,
        newpassword: null,
        renewpassword: null,
        captcha: null
      }
    };
  },
  created() {},
  methods: {
    /**
     * 发送验证码
     */
    sendCode() {
      // if(!this.formData.mobile){
      //     mui.toast('请输入正确的手机号！');
      //     return ;
      // }
      console.log(123)
      this.seconds = 60;
      let get = setInterval(() => {
        this.$nextTick(() => {
          this.seconds = this.seconds - 1;
          if (this.seconds <= 0) {
            clearInterval(get);
          }
        });
      }, 1000);
      // 发送手机验证码
      Base.sendCode({ mobile: this.formData.mobile }).then(res => {
        mui.toast(res.msg);
      });
    },
    /**
     * 提交修改
     */
    confirm() {
      let _This = this;
      let msg = Util.isValidate(_This.formData);
      if (msg) {
        mui.toast(msg);
        return;
      }
      Load.loadStart(this);
      Init.backpwd(_This.formData).then(res => {
        mui.toast(res.msg);
        if (res.code == 1) {
          setTimeout(() => {
            Load.loadEnd(this);
            this.$router.go(-1);
          }, 1000);
        } else {
          setTimeout(() => {
            Load.loadEnd(this);
            return;
          }, 1000);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  // padding: @margin-primary;
  background-color: #fff;
  font-size: 32px;
  .wrap {
    border-bottom: 1px solid #eee;
    .list {
      margin: 5px 30px;
      .display-flex();
      align-items: center;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
      .label {
        flex: 1;
        color: #333;
        .stars {
          color: #ff3b30;
        }
      }
      .code-wrap {
        position: relative;
        .code-inp {
          margin: 0;
          padding: 0;
          background: none;
          border-radius: 8px;
          border: none;
          &::placeholder {
            font-size: 28px;
            color: #ccc;
          }
        }
        .code-btn {
          position: absolute;
          top: 18px;
          right: 0;
          padding: 5px 20px;
          color: #00a2ea;
          font-size: 28px;
          border: 1px solid #00A2EA;
          border-radius: 100px;
        }
      }
      .inp {
        flex: 2.7;
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        font-size: 34px;
        &::placeholder {
          font-size: 28px;
          color: #ccc;
        }
      }
    }
  }
  .btn {
    display: block;
    margin: 60px auto;
    width: 85%;
    color: #fff;
  }
}
</style>