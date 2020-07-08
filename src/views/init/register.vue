<template>
  <div class="page">
    <m-header title="注册" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="wrap">
        <li class="list">
          <span class="label">会员编号</span>
          <input type="text" class="inp" style="color:#00A2EA" placeholder="请输入会员编号" readonly v-model='formData.username'/>
        </li>
        <li class="list">
          <span class="label">
            用户姓名
            <span class="stars">*</span>
          </span>
          <input type="text" class="inp" placeholder="请输入用户姓名" v-model='formData.realname'/>
        </li>
        <li class="list">
          <span class="label">
            手机号码
            <span class="stars">*</span>
          </span>
          <input type="number" class="inp" placeholder="请输入手机号码" v-model='formData.mobile'/>
        </li>
        <li class="list">
          <span class="label">
            登录密码
            <span class="stars">*</span>
          </span>
          <input type="password" class="inp" placeholder="6到15位数字加字母组合" v-model='formData.password'/>
        </li>
        <!-- <div class="tips">提示：6到15位数字加字母组合</div> -->
        <li class="list">
          <span class="label">
            确认密码
            <span class="stars">*</span>
          </span>
          <input type="password" class="inp" placeholder="请再次输入登录密码" v-model='formData.repassword'/>
        </li>
        <li class="list">
          <span class="label">
            交易密码
            <span class="stars">*</span>
          </span>
          <input type="password" class="inp" placeholder="交易密码为6位数字" v-model='formData.paypwd'/>
        </li>
        <!-- <div class="tips">提示：交易密码为6位数字</div> -->
        <li class="list">
          <span class="label">
            确认密码
            <span class="stars">*</span>
          </span>
          <input type="password" class="inp" placeholder="请再次输入交易密码" v-model='formData.repaypwd'/>
        </li>
        <li class="list">
          <span class="label">推荐人</span>
          <input type="text" class="inp" placeholder="推荐人编码（选填）" v-model='tjname'/>
        </li>
        <li class="list">
          <span class="label">
            验证码
            <span class="stars">*</span>
          </span>
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
      <van-checkbox class="agreement-wrap" v-model="checked">
        <span class="text">注册蓓汀美即代表您已阅读并同意</span> 
        <div>
          <span class="agreement" @click="goTo('Agreement','注册协议')">《用户授权协议》</span>及
          <span class="agreement" @click="goTo('Agreement','隐私保护政策')">《隐私保护政策》</span>
        </div>
      </van-checkbox>
      <button class="btn" @click="register">立即注册</button>
      <button class="btn" @click="goTo('Download')">下载APP</button>
    </div>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import Vue from "vue";
import {Util,Load} from '@/assets/commonjs/utils.js';
import { Init,Base } from "@/server/server.js";
import { Checkbox, CheckboxGroup } from "vant";
Vue.use(Checkbox).use(CheckboxGroup);
export default {
  data() {
    return {
      seconds: 0,
      checked: true,
      formData: {
        username: null,
        realname: null,
        mobile: null,
        password: null,
        repassword: null,
        paypwd: null,
        repaypwd: null,
        captcha: null,
      },
      // formData: {
      //   username: null,
      //   realname: '六六六',
      //   mobile: 15177595852,
      //   password: 'admin123',
      //   repassword: 'admin123',
      //   paypwd: 123456,
      //   repaypwd: 123456,
      //   captcha: 6666,
      // },
      tjname: null,
    };
  },
  created() {
    if(this.$route.query.tjname) {
      this.tjname = this.$route.query.tjname;
    }
    this.getUsername();
  },
  methods: {
    goTo(name,type) {
        this.$router.push({name,query:{type}})
    },
    getUsername() {
      Init.getUsername().then(res => {
        if(res.code === 1) {
          this.formData.username =res.data;
        }else {
          mui.toast(res.msg);
        }
      })
    },

    /**
     * 发送验证码
     */
    sendCode() {
      // if(!this.formData.mobile){
      //     mui.toast('请输入正确的手机号！');
      //     return ;
      // }
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
      Base.sendMobile({ mobile: this.formData.mobile }).then(res => {
        console.log(res)
        mui.toast(res.msg);
      });
    },
    /**
     * 注册
     */
    register() {
      // if (!this.account) {
      //   return mui.toast("请输入正确的手机号或邮箱号");
      // }
      let msg = Util.isValidate(this.formData);
      if (msg) {
        mui.toast(msg);
        return;
      }
      this.formData.tjname = this.tjname;
      console.log(this.formData);
      Load.loadStart(this);
      Init.register(this.formData).then(res => {
        mui.toast(res.msg);
        if (res.code == 1) {
          setTimeout(() => {
            Load.loadEnd(this);
            this.$router.replace({ name: "Login" });
          }, 500);
        } else {
          setTimeout(() => {
            Load.loadEnd(this);
            return;
          }, 500);
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
    .tips {
      border-bottom: 1px solid #eee;
      text-align: center;
      font-size: 20px;
      color: #FF3B30;
    }
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
          border: 1px solid #00a2ea;
          border-radius: 100px;
          font-size: 28px;
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
  .agreement-wrap {
    margin: 30px 50px;
    .display-flex();
    justify-content: center;
    align-items: flex-start;
    font-size: 24px;
    color: #333;
    .agreement {
      color: #00a2ea;
    }
    .text {
      font-size: 26.8px;
      // letter-spacing: 1px;
    }
  }
  .btn {
    display: block;
    margin: 60px auto;
    width: 80%;
    color: #fff;
    &:last-child {
      margin-top: -20px;
      background: #fff;
      color: #00a2ea;
      border: 1px solid #00a2ea;
    }
  }
}
</style>