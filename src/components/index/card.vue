<template>
  <div class="card">
    <img class="img" src="https://img.yzcdn.cn/vant/cat.jpeg" alt />
    <div class="name">欧舒丹甜蜜樱花沐浴啫喱/身体乳套装</div>
    <div class="price">
      <div class="left">¥378</div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import "~link-less";
.card {
  width: 336px;
  background: rgba(255, 255, 255, 1);
  // background: pink;
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: 20px;
  margin-top: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
}
.img {
  width: 100%;
  height: 240px;
}
.name {
  padding: 18px 20px;
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.price {
  .display-flex();
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .left {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 59, 48, 1);
  }
  .right {
    width: 40px;
    height: 40px;
    background: blue;
  }
}
</style>
