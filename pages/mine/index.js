//Page Object
Page({
  data: {},
  //options(Object)
  onLoad: function (options) {},
  logout() {
    wx.clearStorageSync();
    wx.reLaunch({
      url: "/pages/login/index",
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
