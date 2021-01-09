var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    designation: "",
    tab: 0,
    user_id_data: [],
    user_id_data7: [],
    project_name: "",
    element: "",
    color_no: "",
    claim_num: "",
    designidea: "",
    cursor: "",
    money: "",
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({
      tab: options.tab - 0,
    });
    console.log(this.data.tab);
  },
  get_money(e) {
    this.setData({
      money: e.detail.value,
    });
  },
  assist_select(e) {
    this.data.user_id_data.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.isCheck = !v.isCheck;
      }
    });
    this.setData({ user_id_data: this.data.user_id_data });
  },
  assist_select7(e) {
    this.data.user_id_data7.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.isCheck = !v.isCheck;
      }
    });
    this.setData({ user_id_data7: this.data.user_id_data7 });
  },
  async user_id() {
    let res = await request({
      url: "get_user_select",
      method: "post",
      data: { role_id: 2 },
    });
    res.data.data.map((v, i) => {
      v["isCheck"] = false;
    });
    this.setData({
      user_id_data: res.data.data,
      user_id_data7: res.data.data,
    });
  },
  get_designation(e) {
    this.setData({
      designation: e.detail.value,
    });
  },
  get_project_name(e) {
    this.setData({
      project_name: e.detail.value,
    });
  },
  get_element(e) {
    this.setData({
      element: e.detail.value,
    });
  },
  get_color_no(e) {
    this.setData({
      color_no: e.detail.value,
    });
  },
  get_claim_num(e) {
    this.setData({
      claim_num: e.detail.value,
    });
  },
  get_designidea(e) {
    this.setData({ designidea: e.detail.value, cursor: e.detail.cursor });
  },
  next_step1() {
    getApp().globalData.designation = this.data.designation;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step2() {
    getApp().globalData.user_id_data = this.data.user_id_data;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step3() {
    getApp().globalData.project.project_name = this.data.project_name;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step4() {
    getApp().globalData.project.element = this.data.element;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step5() {
    getApp().globalData.project.color_no = this.data.color_no;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step6() {
    getApp().globalData.project.claim_num = this.data.claim_num;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step7() {
    getApp().globalData.project.user_id_data = this.data.user_id_data7;
    wx.navigateBack({
      delta: 1,
    });
  },
  next_step9() {
    if (this.data.tab == 9) {
      getApp().globalData.pay_form.money = this.data.money;
      wx.navigateBack({
        delta: 1,
      });
    }
    if (this.data.tab == 10) {
      getApp().globalData.re_form.money = this.data.money;
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  next_step8() {
    getApp().globalData.project.designidea = this.data.designidea;
    getApp().globalData.project.cursor = this.data.cursor;
    wx.navigateBack({
      delta: 1,
    });
  },
  onReady: function () {},
  onShow: function () {
    if (app.globalData.project.claim_num) {
      console.log(1);
      let claim_num = app.globalData.project.claim_num;
      this.setData({
        claim_num,
      });
    }
    if (app.globalData.pay_form.money) {
      console.log(1);
      let money = app.globalData.pay_form.money;
      this.setData({
        money,
      });
    }
    if (app.globalData.project.project_name) {
      console.log(1);
      let project_name = app.globalData.project.project_name;
      this.setData({
        project_name,
      });
    }
    if (app.globalData.project.element) {
      console.log(1);
      let element = app.globalData.project.element;
      this.setData({
        element,
      });
    }
    if (app.globalData.designation) {
      console.log(1);
      let designation = app.globalData.designation;
      this.setData({
        designation,
      });
    }
    if (app.globalData.project.designidea) {
      console.log(1);
      let designidea = app.globalData.project.designidea;
      if (designidea) {
        let cursor = designidea.length;
        this.setData({
          cursor,
        });
      }
      this.setData({
        designidea,
      });
    }
    if (this.data.tab == 2) {
      if (app.globalData.user_id_data.length != 0) {
        let user_id_data = app.globalData.user_id_data;
        this.setData({
          user_id_data: user_id_data,
        });
      } else {
        this.user_id();
      }
    }
    if (this.data.tab == 7) {
      console.log(app.globalData.project.user_id_data.length);
      console.log(app.globalData.project.user_id_data);
      if (app.globalData.project.user_id_data.length != 0) {
        let user_id_data = app.globalData.project.user_id_data;
        console.log(user_id_data);
        this.setData({
          user_id_data7: user_id_data,
        });
      } else {
        this.user_id();
      }
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
