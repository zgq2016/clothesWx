import { request } from "../../request/index.js";
import navigateTo from "../../utils/navigateRoute.js";
Page({
  data: {
    goods: [],
    goodsSearch: [],
    keyword: "",
    class_id: "",
    cardList: [
      {
        materialsCard: "主料卡",
        materials: "主料",
        id: 3,
      },
      {
        materialsCard: "里料卡",
        materials: "里料",
        id: 4,
      },
      {
        materialsCard: "辅料卡",
        materials: "辅料",
        id: 5,
      },
      {
        materialsCard: "工艺卡",
        materials: "工艺",
        id: 6,
      },
    ],
    optionsId: "",
    color_name: "",
    materials: "",
    class_id: "",
  },
  // 全局 接口参数
  QueryParams: {
    class_id: "",
    keyword: "",
    // 页码
    page: 1,
    // 页容量
    page_size: 9,
  },
  // 总页数
  TotalPages: 1,
  //options(Object)
  onLoad: function (options) {
    this.setData({
      optionsId: options.id,
      color_name: options.color,
      class_id: options.class_id,
    });
    this.QueryParams.class_id = this.data.class_id;
  },
  handle_Material(e) {
    wx.showModal({
      title: "提示",
      content: "确定选择",
      success: async (result) => {
        if (result.confirm) {
          let item = e.currentTarget.dataset.item;
          let res = await request({
            url: "project_style_materials_add",
            method: "post",
            data: {
              mainclass: item.materials_mainclass_id,
              materials_color_id:
                item.color_id || item.materials_color_data[0].id,
              materials_id: item.id,
              style_color_name: this.data.color_name,
              style_id: this.data.optionsId,
            },
          });
          if (res.data.error_code === 0) {
            wx.showToast({
              title: "成功",
              success: (result) => {},
            });
            navigateTo(
              `/pages/exploitStatus/index?id=${this.data.optionsId}&color_name=${
                this.data.color_name
              }&navScrollLeft=${1 * 375}&currentTab=${1}`
            );
          }
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  bindColorSelect(e) {
    if (this.data.goods.length > 0) {
      let index = e.currentTarget.dataset.index;
      this.data.goods.map((v, i) => {
        if (index == i) {
          v["color"] = v.materials_color_data[e.detail.value].color;
          v["color_no"] = v.materials_color_data[e.detail.value].color_no;
          v["color_id"] = v.materials_color_data[e.detail.value].id;
        }
      });
      this.setData({
        goods: this.data.goods,
      });
    }
    if (this.data.goodsSearch.length > 0) {
      let index = e.currentTarget.dataset.index;
      this.data.goodsSearch.map((v, i) => {
        if (index == i) {
          v["color"] = v.materials_color_data[e.detail.value].color;
          v["color_no"] = v.materials_color_data[e.detail.value].color_no;
          v["color_id"] = v.materials_color_data[e.detail.value].id;
        }
      });
      this.setData({
        goodsSearch: this.data.goodsSearch,
      });
    }
  },
  bindMaterialsSelect(e) {
    this.QueryParams.page = 1;
    this.QueryParams.class_id = this.data.cardList[e.detail.value].id;
    this.setData({
      materials: this.data.cardList[e.detail.value].materials,
      class_id: this.QueryParams.class_id,
    });
    console.log(this.data.class_id);
    this.data.goodsSearch = [];
    this.getSupplierList();
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
    if (
      this.QueryParams["keyword"] == undefined ||
      this.QueryParams["class_id"] == undefined
    ) {
      let res = await request({
        url: "get_materials_list",
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
    if (
      this.QueryParams["keyword"] != undefined ||
      this.QueryParams["class_id"] == undefined
    ) {
      let res = await request({
        url: "get_materials_list",
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
