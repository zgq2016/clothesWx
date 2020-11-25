var app = getApp();
import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    goods: [],
    goodsSearch: [],
    goods_length: "",
    goodsSearch_length: "",
    keyword: "",
    options_id: "",
    options_index: "",
    options_edit: "",
  },
  // 全局 接口参数
  QueryParams: {
    keyword: "",
    id: 0,
    // 页码
    page: 1,
    // 页容量
    page_size: 24,
  },
  // 总页数
  TotalPages: 1,
  //options(Object)
  onLoad: function (options) {
    this.setData({
      options_id: options.id,
      options_index: options.index,
      options_edit: options.edit,
    });
  },
  nav_goods(e) {
    let item = e.currentTarget.dataset.item;
    let LiningList = app.globalData.materialProcess.LiningList;
    LiningList.map((v, i) => {
      if (i == this.data.options_index) {
        v.material_name = item.name;
      }
    });
    getApp().globalData.materialProcess.LiningList = LiningList;
    wx.navigateBack({
      delta: 1,
    });
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
  async add_ingredient() {
    let res = await request({
      url: "material_add",
      method: "post",
      data: {
        material_name: this.data.keyword,
        id: "",
      },
    });
    this.QueryParams.page = 1;
    this.QueryParams.keyword = this.data.keyword;
    this.getSupplierList();
  },
  async getSupplierList() {
    if (this.QueryParams["keyword"] == undefined) {
      let res = await request({
        url: "get_material_select",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...this.data.goods, ...res.data.data],
      });
      this.setData({
        goods_length: this.data.goods.length,
        goodsSearch_length: this.data.goodsSearch.length,
      });
    }
    if (this.QueryParams["keyword"] != undefined) {
      let res = await request({
        url: "get_material_select",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goods: [],
        goodsSearch: [...this.data.goodsSearch, ...res.data.data],
      });
      this.setData({
        goods_length: this.data.goods.length,
        goodsSearch_length: this.data.goodsSearch.length,
      });
    }
  },
  onReady: function () {},
  onShow: function () {
    this.QueryParams.page = 1;
    this.QueryParams.keyword = "";
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
