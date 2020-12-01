import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    my_role: "",
    goods: [],
    goodsSearch: [],
    switchover_active: false,
    imgwidth: "",
    imgheight: "",
    project_style_add: "",
    designStyle: "",
    permission: [],
  },
  QueryParams: {
    styleno: "",
    page: 1,
    page_size: 9,
  },
  TotalPages: 1,
  //options(Object)
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let project_style_add = permission.indexOf("project_style_add") != -1;
    let designStyle = permission.indexOf("designStyle") != -1;
    this.setData({
      permission,
      project_style_add,
      designStyle,
    });
  },

  gostatus(e) {
    let permission = wx.getStorageSync("permission").split(",");
    if (permission.indexOf("get_style") == -1) {
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
  newProject() {
    navigateTo(`/pages/newStyle/index`);
  },
  switchover() {
    this.data.switchover_active = !this.data.switchover_active;
    this.setData({
      switchover_active: this.data.switchover_active,
    });
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.styleno = e.detail.value;
    this.setData({
      styleno: this.QueryParams.styleno,
    });
    this.data.goodsSearch = [];
    this.init();
  },
  async init() {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }

    if (this.data.my_role == 1) {
      if (this.QueryParams["styleno"] == undefined) {
        let res = await request({
          url: "get_style_all",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goodsSearch: [],
          goods: [...this.data.goods, ...res.data.data],
        });
      }
      if (this.QueryParams["styleno"] != undefined) {
        let res = await request({
          url: "get_style_all",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goods: [],
          goodsSearch: [...this.data.goodsSearch, ...res.data.data],
        });
      }
    } //设计
    if (this.data.my_role == 2) {
      if (this.QueryParams["styleno"] == undefined) {
        let res = await request({
          url: "get_style_purchase",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goodsSearch: [],
          goods: [...this.data.goods, ...res.data.data],
        });
      }
      if (this.QueryParams["styleno"] != undefined) {
        let res = await request({
          url: "get_style_all",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goods: [],
          goodsSearch: [...this.data.goodsSearch, ...res.data.data],
        });
      }
    } //纸样
    if (this.data.my_role == 3) {
      if (this.QueryParams["styleno"] == undefined) {
        let res = await request({
          url: "get_style_pattern",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goodsSearch: [],
          goods: [...this.data.goods, ...res.data.data],
        });
      }
      if (this.QueryParams["styleno"] != undefined) {
        let res = await request({
          url: "get_style_all",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goods: [],
          goodsSearch: [...this.data.goodsSearch, ...res.data.data],
        });
      }
    } //制版
    if (this.data.my_role == 4) {
      if (this.QueryParams["styleno"] == undefined) {
        let res = await request({
          url: "get_style_sample",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goodsSearch: [],
          goods: [...this.data.goods, ...res.data.data],
        });
      }
      if (this.QueryParams["styleno"] != undefined) {
        let res = await request({
          url: "get_style_all",
          method: "post",
          data: this.QueryParams,
        });
        console.log(res);
        this.totalPages = Math.ceil(
          res.data.count / this.QueryParams.page_size
        );
        this.setData({
          goods: [],
          goodsSearch: [...this.data.goodsSearch, ...res.data.data],
        });
      }
    } //采购
  },
  onReady: function () {},
  onShow: function () {
    let my_role = wx.getStorageSync("role");
    this.setData({
      my_role,
      goodsSearch: [],
      goods: [],
    });
    this.QueryParams.page = 1;
    this.QueryParams.styleno = "";
    this.setData({
      styleno: "",
    });

    this.init();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {
    this.setData({
      goods: [],
      goodsSearch: [],
    });
    this.QueryParams.page = 1;
    this.init();
  },
  onReachBottom: function () {
    if (this.totalPages >= this.QueryParams.page) {
      this.QueryParams.page++;
      this.init();
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
