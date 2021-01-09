import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    arr: [],
    style_id: "",
    options_id: "",
    style_color_name: "",
    quantity: "",
    balance: "",
    paid_money: "",
    price: "",
    totalprice: "",
    options_ss: "",
    state: "",
    materials_id: "",
    status_list: [],
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({
      options_id: options.id,
      options_ss: options.ss,
      style_id: options.style_id,
      style_color_name: options.style_color_name,
    });
    this.init();
  },
  bindStatusSelect(e) {
    let status = this.data.status_list[e.detail.value].status;
    if (status == "修改订单") {
      this.go_modify_order();
    }
    if (status == "退单") {
      this.go_close_order();
    }
    if (status == "延迟回料") {
      this.go_delay_back();
    }
    if (status == "部分回料") {
      this.go_portion_back();
    }
    if (status == "全部回料") {
      this.go_all_back();
    }
    console.log(this.data.status_list[e.detail.value].status);
  },
  go_close_order() {
    navigateTo(
      `/pages/feed_back/index?id=${this.data.options_id}&style_id=${this.data.style_id}&status=4&paid_money=${this.data.paid_money}&received_quantity=${this.data.received_quantity}`
    );
    // wx.showModal({
    //   title: "提示",
    //   content: "是否取消订单",
    //   success: async (result) => {
    //     if (result.confirm) {
    //       let res = await request({
    //         url: "style_purchase_del",
    //         method: "post",
    //         data: {
    //           id: this.data.options_id,
    //         },
    //       });
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //       });
    //       if (res.data.error_code === 0) {
    //         navigateTo(
    //           `/pages/exploitStatus/index?id=${
    //             this.data.style_id
    //           }&navScrollLeft=${2 * 375}&currentTab=${2}`
    //         );
    //       }
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {},
    // });
  },
  go_modify_order() {
    navigateTo(
      `/pages/material_purchasing_edit/index?id=${this.data.options_id}&style_id=${this.data.style_id}&materials_id=${this.data.materials_id}`
    );
  },
  go_delay_back() {
    navigateTo(
      `/pages/feed_back/index?id=${this.data.options_id}&style_id=${this.data.style_id}&status=2`
    );
  },
  go_portion_back() {
    navigateTo(
      `/pages/feed_back/index?id=${this.data.options_id}&style_id=${this.data.style_id}&status=1`
    );
  },
  go_all_back() {
    let {
      options_id,
      style_id,
      quantity,
      balance,
      paid_money,
      price,
      totalprice,
    } = this.data;
    navigateTo(
      `/pages/feed_back/index?id=${options_id}&style_id=${style_id}&quantity=${quantity}&balance=${balance}&paid_money=${paid_money}&price=${price}&totalprice=${totalprice}&status=3`
    );
  },
  async init() {
    let res = await request({
      url: "get_materials_procure_list",
      data: {
        style_id: this.data.style_id,
        style_color_name: this.data.style_color_name,
      },
      method: "post",
    });
    let arr = [];
    let state = "";
    let quantity = "";
    let balance = "";
    let paid_money = "";
    let price = "";
    let totalprice = "";
    let materials_id = "";
    let received_quantity = "";
    res.data.data.map((v, i) => {
      v.style_materials_data.map((v1, i1) => {
        if (v1.id == this.data.options_id) {
          console.log(v1);
          arr = v1.style_purchase_log_data;
          state = v1.state;
          materials_id = v1.materials_id;
          quantity = v1.quantity;
          balance = v1.balance;
          paid_money = v1.paid_money;
          price = v1.price;
          totalprice = v1.totalprice;
          received_quantity = v1.received_quantity;
        }
      });
    });
    arr.reverse();
    this.setData({
      arr,
      arr_length: arr.length - 1,
      quantity,
      balance,
      paid_money,
      price,
      totalprice,
      state,
      materials_id,
      received_quantity,
    });
    let status_list = [];
    if (state == 1) status_list.splice(0, 0, { status: "修改订单" });
    if (state > 0) status_list.splice(1, 0, { status: "退单" });
    if (state < 4) status_list.splice(2, 0, { status: "延迟回料" });
    if (state < 4) status_list.splice(3, 0, { status: "部分回料" });
    if (state < 4) status_list.splice(4, 0, { status: "全部回料" });
    this.setData({
      status_list,
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
