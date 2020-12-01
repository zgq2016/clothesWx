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
    designFile: "",
    produce_lotadd: "",
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
    let designFile = permission.indexOf("designFile") != -1;
    let produce_lotadd = permission.indexOf("produce_lotadd") != -1;
    this.setData({
      permission,
      designFile,
      produce_lotadd,
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
  async newProject() {
    let arr = [];
    let arr_id_data = [];
    if (this.data.goods == 0) {
      arr = this.data.goodsSearch;
    } else {
      arr = this.data.goods;
    }
    console.log(arr);
    arr.map((v, i) => {
      if (v.checked == true) {
        arr_id_data.push({ id: v.id });
      }
    });
    if (arr_id_data.length < 1) {
      wx.showToast({
        title: "请勾选下单物料",
        icon: 'none',
      });
      return;
    }
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: async (result) => {
        if (result.confirm) {
          let res = await request({
            url: "produce_order_create_add",
            method: "post",
            data: {
              style_id_data: arr_id_data,
            },
          });
          console.log(res);
          let arr_style_id_data = [];
          arr_id_data.map((v, i) => {
            arr_style_id_data.push({ style_id: v.id });
          });
          let res1 = await request({
            url: "produce_lotadd",
            method: "post",
            data: {
              style_id_data: arr_style_id_data,
            },
          });

          if (res1.data.error_code == 0) {
            this.setData({
              styleno: "",
              goodsSearch: [],
              goods: [],
            });
            this.init();
          }
          wx.showToast({
            title: res1.data.msg,
            icon: 'none',
          });
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  handleCheck(e) {
    let arr = [];
    if (this.data.goods.length == 0) {
      arr = this.data.goodsSearch;
      arr.map((v, i) => {
        if (e.currentTarget.dataset.item.id == v.id) {
          v.checked = !v.checked;
        }
      });
      this.setData({
        goodsSearch: arr,
      });
    } else {
      arr = this.data.goods;
      arr.map((v, i) => {
        if (e.currentTarget.dataset.item.id == v.id) {
          v.checked = !v.checked;
        }
      });
      this.setData({
        goods: arr,
      });
    }
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

    if (this.QueryParams["styleno"] == undefined) {
      let res = await request({
        url: "get_style_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...this.data.goods, ...res.data.data],
      });
      this.data.goods.map((v, i) => {
        v["checked"] = false;
      });
      this.setData({
        goods: this.data.goods,
      });
    }
    if (this.QueryParams["styleno"] != undefined) {
      let res = await request({
        url: "get_style_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goods: [],
        goodsSearch: [...this.data.goodsSearch, ...res.data.data],
      });
      this.data.goodsSearch.map((v, i) => {
        v["checked"] = false;
      });
      this.setData({
        goodsSearch: this.data.goodsSearch,
      });
    }
  },
  onReady: function () {},
  onShow: function () {
    let my_role = wx.getStorageSync("role");
    this.setData({
      my_role,
    });
    this.QueryParams.page = 1;
    this.QueryParams.styleno = "";
    this.setData({
      styleno: "",
      goodsSearch: [],
      goods: [],
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
