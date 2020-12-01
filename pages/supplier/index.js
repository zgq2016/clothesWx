import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    goods: [],
    goodsSearch: [],
    companyname: "",
    permission: [],
    distributor_list: "",
    supplier_add: "",
  },
  // 全局 接口参数
  QueryParams: {
    companyname: "",
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
    let permission = wx.getStorageSync("permission").split(",");
    let distributor_list = permission.indexOf("distributor_list") != -1;
    let supplier_add = permission.indexOf("supplier_add") != -1;
    this.setData({ permission, distributor_list, supplier_add });
  },
  nav_goods(e) {
    navigateTo(
      `/pages/supplierView/index?id=${e.currentTarget.dataset.item.id}`
    );
  },
  newProject() {
    navigateTo(`/pages/supplierEntering/index`);
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.companyname = e.detail.value;
    this.setData({
      companyname: this.QueryParams.companyname,
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
    if (this.QueryParams["companyname"] == undefined) {
      let res = await request({
        url: "get_supplier_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...this.data.goods, ...res.data.data],
      });
    }
    if (this.QueryParams["companyname"] != undefined) {
      let res = await request({
        url: "get_supplier_list",
        method: "post",
        data: this.QueryParams,
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
    this.QueryParams.companyname = "";
    this.setData({
      companyname: "",
      goods: [],
      goodsSearch: [],
    });
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
        icon: 'none',
      });
    }
  },
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
