<template>
  <div class="page">
    <m-header title="设置" :canback="Boolean(1)"></m-header>
    <section class="body">
      <router-link
        class="psw"
        :to="{ name: 'SetPwd', query: { type: 'login' } }"
      >
        修改登陆密码
        <span>></span>
      </router-link>
      <router-link
        class="psw"
        :to="{ name: 'SetPwd', query: { type: 'trade' } }"
      >
        修改支付密码
        <span>></span>
      </router-link>
      <button class="btn-quit" @click="toQuit">退出登录</button>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Init } from "@/server/server.js";
import { Util, Load, HB } from "@/assets/commonjs/utils.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "set",
  data() {
    return {
      isApp: false,
      //   icon: require("@/assets/images/btm/Rectangle.png"),
      navList: [
        {
          name: "修改登录密码",
          route: "SetPwd",
          type: "login",
        },
        {
          name: "修改交易密码",
          route: "SetPwd",
          type: "trade",
        },
        {
          name: "晒图奖励",
          route: "ShaiTu",
          type: "",
        },
      ],
    };
  },
  mounted() {
    // this.getShare();
    // setTimeout(() => {
    //     this.share();
    // }, 10000);
  },
  computed: {
    ...mapGetters(["userInfo", "version"]),
  },
  methods: {
    ...mapMutations([
      "saveUserInfo",
      "saveUserID",
      "saveCoinTxt",
      "saveProData",
      "saveVersion",
    ]),
    initData() {
      try {
        if (plus) {
          this.isApp = true;
        }
      } catch (e) {}
      HB.getVersion((data) => {
        localStorage.setItem("version", data);
        this.saveVersion(data);
      });
    },
    getShare() {
      try {
        if (plus) {
          plus.share.getServices(
            (res) => {
              res[2].send(
                {
                  type: "image",
                  pictures: [
                    "http://fagzlz.a6shop.net:80/uploads/20190821/2924b90238ff3e6e48b4e85b71b5b39b.png",
                  ],
                  extra: { scene: "WXSceneSession" },
                },
                function () {
                  alert("分享成功！");
                },
                function (e) {
                  alert("分享失败：" + e.message);
                }
              );
            },
            (err) => {
              console.log(err);
            }
          );
        }
      } catch (e) {}
    },
    /**
     * 退出确认
     */
    toQuit() {
      try {
        if (plus) {
          mui.confirm("退出登录", (actions) => {
            if (actions.index == 0) {
              sessionStorage.setItem('btmNav',3);
              this.quit();
              }
          });
        }
      } catch (e) {
        mui.confirm("退出登录", (actions) => {
          if (actions.index == 1) {
            sessionStorage.setItem('btmNav',3);
            this.quit();
            }
        });
      }
    },
    /**
     * 退出操作
     */
    quit() {
      Load.loadStart(this);
      Init.quit().then((res) => {
        if (res.code == 1) {
          mui.toast(res.msg);
          setTimeout(() => {
            this.clearLocal();
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
    },
    /**
     * 清楚缓存
     */
    clearLocal() {
      localStorage.clear();
      this.saveUserInfo(null);
      this.saveUserID(null);
      this.saveCoinTxt(null);
      this.saveProData(null);
      sessionStorage.setItem("btmNav", 0);
    },
  },
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background-color: @bg-color;
  color: white;
  //   .list {
  //     margin: @margin-primary;
  //     .item {
  //       .display-flex();
  //       justify-content: space-between;
  //       align-items: center;
  //       padding: @padding-primary 0;
  //     }
  //   }
  .btn-quit {
    margin: 10% auto;
    color: #00a2ea;
    display: block;
    width: 600px;
    height: 88px;
    border-radius: 44px;
    border: 1px solid rgba(0, 162, 234, 1);
  }
}
.psw {
  background: #fff;
  color: #000;
  height: 96px;
  .display-flex();
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 34px;
  span {
    width: 30px;
    height: 40px;
    color: #cccccc;
  }
}
</style>
