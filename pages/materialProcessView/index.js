import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";

Page({
  data: {
    optionsId: "",
    obj: {},
  },
  //options(Object)
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let materials_edit = permission.indexOf("materials_edit") != -1;
    console.log(options);
    this.setData({
      optionsId: options.id,
      materials_edit,
    });
    this.getDetailData();
  },
  nav_goods(e) {
    console.log(this.data.obj);
    navigateTo(`/pages/materialProcessEdit/index?id=${this.data.obj.id}`);
  },
  handleBackLink() {
    wx.navigateBack({
      //  delta 上几个页面
      delta: 1,
    });
  },
  async getDetailData() {
    let res = await request({
      url: "get_materials_info",
      method: "post",
      data: {
        id: this.data.optionsId,
      },
    });
    console.log(res);
    this.setData({
      obj: res.data.data,
    });
  },
  handle_materials_del() {
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: async (result) => {
        if (result.confirm) {
          let res = await request({
            url: "materials_del",
            method: "post",
            data: {
              id: this.data.optionsId,
            },
          });
          navigateTo(`/pages/materialProcess/index`);
          wx.showToast({
            title: "删除成功",
            icon: 'none',
          });
         
            
        }
      },
      fail: () => {},
      complete: () => {},
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
