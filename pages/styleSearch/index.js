


import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    goods: [],
    goodsSearch: [],
    keyword: "",
  },
  // 全局 接口参数
  QueryParams: {
    keyword: "",
    id: 0,
    // 页码
    page: 1,
    // 页容量
    page_size: 9,
  },
  // 总页数
  TotalPages: 1,
  //options(Object)
  onLoad: function (options) {},
  nav_goods(e) {
    navigateTo(
      `/pages/newAdStyle/index?id=${e.currentTarget.dataset.item.id}`
    );
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.keyword = e.detail.value;
    this.setData({
      keyword: this.QueryParams.keyword,
    });
    this.data.goodsSearch = [];
    this.getSupplierList();
  },
  async getSupplierList() {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }
    if (this.QueryParams["keyword"] == undefined) {
      let res = await request({
        url: "get_project_style_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      if (res.data.error_code == 0) {
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goodsSearch: [],
          goods: [...this.data.goods, ...res.data.data],
        });
      }
    }
    if (this.QueryParams["keyword"] != undefined) {
      let res = await request({
        url: "get_project_style_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      if (res.data.error_code == 0) {
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goods: [],
          goodsSearch: [...this.data.goodsSearch, ...res.data.data],
        });
      }
    }
  },
  onReady: function () {},
  onShow: function () {
    this.QueryParams.page = 1;
    this.QueryParams.keyword = "";
    this.setData({
      keyword: "",
    });
    this.data.goodsSearch = [];
    this.data.goods = [];
    this.getSupplierList();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {
    this.setData({
      goods: [],
      goodsSearch: [],
    });
    this.QueryParams.page = 1;
    this.getSupplierList();
  },
  onReachBottom: function () {
    if (this.totalPages >= this.QueryParams.page) {
      this.QueryParams.page++;
      this.getSupplierList();
    } else {
      wx.showToast({
        title: "已经没有下一页的数据了",
      });
    }
  },
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
