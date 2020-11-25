import { request } from "../../request/index.js";
import { url } from "../../request/url";
import navigateTo from "../../utils/navigateRoute.js";
import WeCropper from "../../components/we-cropper/we-cropper.js";
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio;
const height = device.windowHeight - 70;
const fs = (width / 750) * 2;
Page({
  data: {
    optionsId: "",
    color_name: "",
    color: "",
    card: [],
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({
      optionsId: options.id - 0,
      color: options.color,
    });
  },
  handleCartCheck(e) {
    let index = e.currentTarget.dataset.index;
    this.data.card.map((v, i) => {
      if (index == i) {
        v.style_materials_data.map((v1, i1) => {
          v1.isCheck = !v1.isCheck;
        });
      }
    });
    this.setData({ card: this.data.card });
    console.log(this.data.card);
  },
  async bindColorSelect(e) {
    let item = e.currentTarget.dataset.item1;
    console.log(item);
    if (item.materials_color_data[e.detail.value].color == "添加颜色") {
      navigateTo(
        `/pages/materialProcessEdit/index?id=${item.materials_id}&back=1`
      );
    } else {
      let res = await request({
        url: "style_materials_list_color_edit",
        method: "post",
        data: {
          id: item.id,
          materials_color_id: item.materials_color_data[e.detail.value].id,
        },
      });
      this.init();
      // this.Materials_processInit();
    }
  },
  async init() {
    let res = await request({
      url: "get_style",
      data: {
        id: this.data.optionsId,
      },
      method: "post",
    });
    this.setData({
      color_name: res.data.data.style_color_data[0].style_color_name,
    });
    this.Materials_processInit();
  },
  async Materials_processInit() {
    let res = await request({
      url: "get_style_materials_list",
      method: "post",
      data: {
        style_id: this.data.optionsId,
        style_color_name: this.data.color_name,
      },
    });
    res.data.data.map((v, i) => {
      v.style_materials_data.map((v1, i1) => {
        v1.materials_color_data[v1.materials_color_data.length] = {
          color: "添加颜色",
        };
        v1["isCheck"] = false;
        v1["materials_mainclass_name_id"] = v1.materials_mainclass_name.slice(
          0,
          1
        );
      });
    });
    console.log(res);
    this.setData({
      card: res.data.data,
    });
  },
  async next_step() {
    let style_materials_list_data = [];
    this.data.card.map((v, i) => {
      v.style_materials_data.map((v1, i1) => {
        if (v1.isCheck == true) {
          console.log(v1.mainclass);
          style_materials_list_data.push({
            id: v1.id,
            mainclass: v.mainclass,
            materials_id: v1.materials_id,
            materials_color_id: v1.style_color_id,
          });
        }
      });
    });
    let res = await request({
      url: "project_style_materials_list_add",
      method: "post",
      data: {
        style_id: this.data.optionsId,
        style_color_name: this.data.color,
        style_materials_list_data,
      },
    });
    console.log(res);
    navigateTo(
      `/pages/exploitStatus/index?id=${this.data.optionsId}&navScrollLeft=${
        1 * 375
      }&currentTab=${1}&color_name=${this.data.color}`
    );
  },
  onReady: function () {},
  onShow: function () {
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
