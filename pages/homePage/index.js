import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    style_list: [],
    style_pattern_list: [],
    style_sample_list: [],
    permission: [],
    project_list: [],
    homepage: "",
    Z2000: "",
    Z4000: "",
    Z5000: "",
    Z6000: "",
  },
  QueryParams: {
    // 页码
    page: 1,
    // 页容量
    page_size: 10,
  }, // 总页数
  totalPages: 0,
  onLoad: function (options) {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }
    let permission = wx.getStorageSync("permission").split(",");
    let homepage = permission.indexOf("homepage") != -1;
    let Z2000 = permission.indexOf("Z2000") != -1;
    let Z4000 = permission.indexOf("Z4000") != -1;
    let Z5000 = permission.indexOf("Z5000") != -1;
    let Z6000 = permission.indexOf("Z6000") != -1;
    this.setData({
      permission,
      homepage,
      Z2000,
      Z4000,
      Z5000,
      Z6000,
    });
    console.log(this.data.permission);
  },
  go_style1(e) {
    navigateTo(
      `/pages/exploitStatus/index?id=${e.currentTarget.dataset.item.id}&tabName=设计备注`
    );
  },
  go_style2(e) {
    navigateTo(
      `/pages/exploitStatus/index?id=${e.currentTarget.dataset.item.id}&tabName=纸样`
    );
  },
  go_style3(e) {
    navigateTo(
      `/pages/exploitStatus/index?id=${e.currentTarget.dataset.item.id}&tabName=样衣`
    );
  },
  go_project(e) {
    navigateTo(
      `/pages/projectDetails/index?id=${e.currentTarget.dataset.item.id}`
    );
  },
  async project_init() {
    let res = await request({
      url: "get_project_list",
      method: "post",
      data: this.QueryParams,
    });
    res.data.data.map((v, i) => {
      if (v.projecttype == "0") {
        v["projecttypename"] = "意向订单";
      }
      if (v.projecttype == "1") {
        v["projecttypename"] = "阶段工作";
      }
      if (v.projecttype == "2") {
        v["projecttypename"] = "企划系列";
      }
    });
    this.setData({
      project_list: res.data.data,
    });
  },
  async style_init() {
    if (this.data.permission.indexOf("Z3000") != -1) {
      let res = await request({
        url: "get_style_all",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        style_list: res.data.data,
      });
    }
  },
  async pattern_init() {
    if (this.data.permission.indexOf("Z5000") != -1) {
      let res = await request({
        url: "get_style_pattern",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        style_pattern_list: res.data.data,
      });
    }
  },
  async sample_init() {
    if (this.data.permission.indexOf("Z6000") != -1) {
      let res = await request({
        url: "get_style_sample",
        method: "post",
        data: this.QueryParams,
      });
      this.setData({
        style_sample_list: res.data.data,
        style_sample_list_length: res.data.count,
      });
    }
  },
  onReady: function () {},
  onShow: function () {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }

    this.style_init();
    this.pattern_init();
    this.sample_init();
    this.project_init();
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
