import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {},
  //options(Object)
  onLoad: function (options) {},
  go_supplier() {
    navigateTo(`/pages/supplier/index`);
  },
  go_materialProcess() {
    navigateTo(`/pages/materialProcess/index`);
  },
  go_project() {
    navigateTo(`/pages/project/index`);
  },
  go_designFile() {
    navigateTo(`/pages/designFile/index`);
  },
  go_advance_reimbursement() {
    navigateTo(`/pages/advance_reimbursement/index`);
  },
  go_west_produced() {
    wx.navigateToMiniProgram({
      appId: "wxd4ffb13f8a68b617",
      path: "pages/homePage/index",
      extraData: {
        foo: 'bar',
      },
      envVersion: "trial",
      success(res) {
        console.log(res);
        // 打开成功
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          title: res,
          icon: "none",
        });
      },
      complete(res) {
        console.log(res);
        // 调用结束  不管成功还是失败都执行
      },
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
