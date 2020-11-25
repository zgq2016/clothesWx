import {
  request
} from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    username: '',
    password: '',
  },
  //options(Object)
  onLoad: function (options) {},
  async handleLogin(e) {
    let res = await request({
      url: "login",
      method: "post",
      data: {
        username: e.detail.value.username.trim(),
        password: e.detail.value.password,
      },
    });
    console.log(res);
    if (res.data.error_code === 0) {
      console.log(res);
      getApp().globalData.token = res.data.data.token;
      wx.setStorageSync("token", res.data.data.token);
      wx.setStorageSync("permission", res.data.data.permission);
      wx.setStorageSync("user_id", res.data.data.id);
      wx.setStorageSync("level", res.data.data.level);
      wx.setStorageSync("power", res.data.data.power);
      wx.setStorageSync("role", res.data.data.role);
      navigateTo("/pages/homePage/index");
      // wx.navigateBack({
      //   delta: 1
      // });
    }
    wx.showToast({
      title: res.data.msg,
      icon: "none",
      image: "",
      duration: 1500,
      mask: false,
    });
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});