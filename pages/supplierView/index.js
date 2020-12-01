import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";

Page({
  data: {
    optionsId: "",
    editSupplier: "",
    permission: [],
    obj: {},
  },
  //options(Object)
  onLoad: function (options) {
    console.log(options);
    let permission = wx.getStorageSync("permission").split(",");
    let editSupplier = permission.indexOf("editSupplier") != -1;
    this.setData({
      optionsId: options.id,
      permission,
      editSupplier,
    });
    this.getDetailData();
  },
  nav_goods(e) {
    console.log(this.data.obj);
    navigateTo(`/pages/supplierEdit/index?id=${this.data.obj.id}`);
  },
  async getDetailData() {
    let res = await request({
      url: "get_supplier_info",
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
  handle_supplier_del() {
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: async (result) => {
        if (result.confirm) {
          let res = await request({
            url: "supplier_del",
            method: "post",
            data: {
              id: this.data.optionsId,
            },
          });
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          });
          if (res.data.error_code === 0) {
            navigateTo(`/pages/supplier/index`);
          }
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
