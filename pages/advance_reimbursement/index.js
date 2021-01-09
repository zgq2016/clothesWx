import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    form: {
      ctime_start: "",
      ctime_end: "",
      type: "",
      user_id: "",
      user_name: "",
    },
    show_active: false,
    show_active1: false,
    user_select: [],
    type_list: [
      { name: "预支", id: 1 },
      { name: "报销", id: 2 },
      { name: "研发", id: 3 },
      { name: "生产", id: 4 },
      { name: "仓库", id: 5 },
    ],
  },
  //options(Object)
  onLoad: function (options) {
    this.day();
    this.get_user();
  },
  next_step() {
    this.show_active1 = false;
  },
  day() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    var day = d.getDate();
    this.setData({
      ["form.ctime_start"]: `${year}-${month}-${1}`,
      ["form.ctime_end"]: `${year}-${month}-${day}`,
    });
  },
  ani1() {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease",
      delay: 0,
    });
    animation.opacity(1).height(100).step();
    this.setData({
      translate: animation.export(),
    });
  },
  ani2() {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease",
      delay: 0,
    });
    animation.opacity(0).height(0).step();
    this.setData({
      translate: animation.export(),
    });
  },
  search_tab() {
    let show_active1 = this.data.show_active1;
    show_active1 = !show_active1;
    this.setData({
      show_active1,
    });
  },
  release_tab() {
    let show_active = this.data.show_active;
    show_active = !show_active;
    if (show_active) {
      this.ani1();
    } else {
      this.ani2();
    }
    this.setData({
      show_active,
    });
  },
  async get_user() {
    let res = await request({
      url: "get_user_select",
    });
    this.setData({
      user_select: res.data.data,
    });
  },
  bindProposerSelect: function (e) {
    this.setData({
      ["form.user_id"]: this.data.user_select[e.detail.value].id,
      ["form.user_name"]: this.data.user_select[e.detail.value].name,
    });
  },
  bindTypeSelect: function (e) {
    this.setData({
      ["form.type"]: this.data.type_list[e.detail.value].name,
    });
  },
  bindCtimeStartChange: function (e) {
    this.setData({
      ["form.ctime_start"]: e.detail.value,
    });
  },
  bindCtimeEndChange: function (e) {
    this.setData({
      ["form.ctime_end"]: e.detail.value,
    });
  },
  handleActiveShow() {
    this.setData({
      active: true,
    });
  },
  handleActiveHide() {
    this.setData({
      active: false,
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
