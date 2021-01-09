var app = getApp();
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
    console.log(e);
    let { id } = e.currentTarget.dataset.item;
    navigateTo(`/pages/newAdStyle/index?id=${id}`);
  },
  /* 
  
  
  
color_code: ""
ctime: "2020-11-03 11:19:12"
design_status: "1"
designidea: "000"
designidea_pic_data: (3) [{…}, {…}, {…}]
file: 1
id: 185
is_urgent: 0
materials_status: "4"
pattern_status: "1"
project_id: "0"
project_name: ""
purchase_status: "6"
sample_status: "0"
season: "夏"
status: "3"
style_color: ""
style_color_data: [{…}]
style_color_pic_url: "https://zhongshuyan.com/upload/20201111/20201111174858.png"
style_log: (11) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
style_materials_data: (4) [{…}, {…}, {…}, {…}]
style_pic_url: "https://zhongshuyan.com/upload/20201111/20201111174852.png"
style_price: "0.00"
style_type: " 衬衫"
stylename: "测试"
styleno: "23020401001"
user_id: "1"
user_id_data: []
user_name: "zaan"
year: "2023"
  */
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
        icon: "none",
      });
    }
  },
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
