import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    goods: [],
    goodsSearch: [],
    stylekeyword: "",
    permission: [],
    itemDesign: "",
    project_add: "",
    get_project_list: "",
  },
  QueryParams: {
    stylekeyword: "",
    // 页码
    page: 1,
    // 页容量
    page_size: 9,
  }, // 总页数
  totalPages: 0,
  //options(Object)
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let itemDesign = permission.indexOf("itemDesign") != -1;
    let project_add = permission.indexOf("project_add") != -1;
    let get_project_list = permission.indexOf("get_project_list") != -1;
    this.setData({
      permission,
      itemDesign,
      project_add,
      get_project_list,
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
  go_project(e) {
    this.setData({
      active: false,
    });
    console.log(e);
    navigateTo(
      `/pages/projectDetails/index?id=${e.currentTarget.dataset.item.id}`
    );
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.stylekeyword = e.detail.value;
    this.setData({
      stylekeyword: this.QueryParams.stylekeyword,
    });
    this.data.goodsSearch = [];
    this.project_init();
  },
  async project_init() {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }
    if (this.QueryParams["stylekeyword"] == undefined) {
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
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...this.data.goods, ...res.data.data],
      });
    }
    if (this.QueryParams["stylekeyword"] != undefined) {
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
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goods: [],
        goodsSearch: [...this.data.goodsSearch, ...res.data.data],
      });
    }
  },
  onReady: function () {},
  onShow: function () {
    this.QueryParams.page = 1;
    this.QueryParams.stylekeyword = "";
    this.setData({
      stylekeyword: "",
    });
    this.data.goodsSearch = [];
    this.data.goods = [];
    this.project_init();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    if (this.totalPages >= this.QueryParams.page) {
      this.QueryParams.page++;
      this.project_init();
    } else {
      wx.showToast({
        title: "已经没有下一页的数据了",
        icon: 'none',
      });
    }
  },
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
