import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    active: false,
    switchover_active: false,
    optionsId: "",
    obj: {},
    my_role: "",
    project_edit: "",
    project_del: "",
    get_project_style_list: "",
    project_style_add: "",
    get_project: "",
  },
  //options(Object)
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let project_edit = permission.indexOf("project_edit") != -1;
    let project_del = permission.indexOf("project_del") != -1;
    let get_project_style_list =
      permission.indexOf("get_project_style_list") != -1;
    let project_style_add = permission.indexOf("project_style_add") != -1;
    let get_project = permission.indexOf("get_project") != -1;
    this.setData({
      optionsId: options.id,
      project_edit,
      project_del,
      get_project_style_list,
      project_style_add,
      get_project,
    });
  },
  get_image_info(e) {
    let item = e.currentTarget.dataset.item;
    var _this = this;
    wx.getImageInfo({
      src: item,
      success: function (res) {
        console.log(res);
        _this.setData({
          imgwidth: res.width,
          imgheight: res.height,
        });
      },
    });
  },
  gostatus(e) {
    let permission = wx.getStorageSync("permission").split(",");
    let get_style = permission.indexOf("get_style") != -1;
    console.log(get_style);
    if (get_style == false) {
      return;
    }
    if (this.data.my_role == 1 || this.data.my_role == 2) {
      navigateTo(
        `/pages/exploitStatus/index?id=${
          e.currentTarget.dataset.item.id
        }&navScrollLeft=${0 * 375}&currentTab=${0}`
      );
    }
    if (this.data.my_role == 3) {
      navigateTo(
        `/pages/exploitStatus/index?id=${
          e.currentTarget.dataset.item.id
        }&navScrollLeft=${3 * 375}&currentTab=${3}`
      );
    }
    if (this.data.my_role == 4) {
      navigateTo(
        `/pages/exploitStatus/index?id=${
          e.currentTarget.dataset.item.id
        }&navScrollLeft=${4 * 375}&currentTab=${4}`
      );
    }
    // if (this.data.my_role == 18) {
    //   navigateTo(
    //     `/pages/exploitStatus/index?id=${
    //       e.currentTarget.dataset.item.id
    //     }&tabName=${"设计备注"}`
    //   );
    // }
  },
  go_projectEdit() {
    navigateTo(`/pages/projectEdit/index?id=${this.data.optionsId}`);
  },
  solt_switchover() {
    this.data.switchover_active = !this.data.switchover_active;
    this.setData({
      switchover_active: this.data.switchover_active,
    });
  },
  handleBackLink() {
    wx.navigateBack({
      //  delta 上几个页面
      delta: 1,
    });
  },
  async init() {
    let res = await request({
      url: "get_project",
      data: { id: this.data.optionsId },
      method: "post",
    });
    if (res.data.data.projecttype == "0") {
      res.data.data["projecttypename"] = "意向订单";
    }
    if (res.data.data.projecttype == "1") {
      res.data.data["projecttypename"] = "阶段工作";
    }
    if (res.data.data.projecttype == "2") {
      res.data.data["projecttypename"] = "企划系列";
    }
    this.setData({
      obj: res.data.data,
    });
  },
  handleActiveShow() {
    this.setData({ active: true });
  },
  handleActiveHide() {
    this.setData({ active: false });
  },
  newAddStyle() {
    this.setData({ active: false });
    navigateTo(`/pages/newAddStyle/index?id=${this.data.optionsId}`);
  },
  styleSearch() {
    this.setData({ active: false });
    navigateTo(`/pages/styleSearch/index?id=${this.data.optionsId}`);
  },
  onReady: function () {},
  onShow: function () {
    let my_role = wx.getStorageSync("role");
    this.setData({
      my_role,
    });
    this.init();
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
