var app = getApp();
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
    we_cropper_active: false,
    we_cropper_active_status: "",
    step_status: 0,
    cropperOpt: {
      id: "cropper",
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 160) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: height * 0.5 - 300 * 0.5, // 裁剪框y轴期起点
        width: 160, // 裁剪框宽度
        height: 300, // 裁剪框高度
      },
    },
    images_upload_list: [],
    assist_active: false,
    assist_select_list: [],
    user_id_data: [],
    user_id_data_list: [],

    level: "",

    focus: false,
    styleno: "",
    stylename: "",
    project_id: "",
    stylist_id: "",
    designidea: "",

    style_pic_url: "",
    style_color_pic_url: "",
    project: "",
    project_list: [],
    year_list: [],
    year: "",
    season_list: [],
    season: "",
    stylist_list: [],
    stylist: "",

    style_types: [],
    style_typeList: [
      ["无脊柱动物", "脊柱动物", "aa"],
      ["扁性动物", "线形动物", "环节动物", "软体动物", "节肢动物"],
    ],
    style_typeSelece: [],
    style_types: [],
    style_typeIndex: [0, 0],
    style_type: "",
    cursor: "",
    optionsId: "",
  },
  onShow: function () {
    let designation = app.globalData.designation;
    let user_id_data = app.globalData.user_id_data;
    let designidea = app.globalData.designidea;
    let cursor = app.globalData.cursor;
    let styleno = app.globalData.styleno;
    let project = app.globalData.project;
    let project_id = app.globalData.project_id;
    let style_type = app.globalData.style_type;
    let year = app.globalData.year;
    let season = app.globalData.season;
    let stylist = app.globalData.stylist;
    let stylist_id = app.globalData.stylist_id;
    let images_upload_list = app.globalData.images_upload_list;
    let user_id_data_list = [];
    user_id_data.map((v, i) => {
      if (v.isCheck == true) {
        user_id_data_list.push(v);
      }
    });
    this.setData({
      stylename: designation,
      user_id_data: user_id_data,
      user_id_data_list,
      designidea,
      cursor,
      styleno,
      project,
      project_id,
      style_type,
      year,
      season,
      stylist,
      stylist_id,
      user_id_data,
      images_upload_list,
    });
  },
  //options(Object)
  onLoad: function (options) {
    app.globalData.designation = "";
    app.globalData.user_id_data = [];
    app.globalData.designidea = "";
    app.globalData.cursor = "";
    app.globalData.styleno = "";
    app.globalData.project = "";
    app.globalData.project_id = "";
    app.globalData.style_type = "";
    app.globalData.year = "";
    app.globalData.season = "";
    app.globalData.stylist = "";
    app.globalData.stylist_id = "";
    app.globalData.images_upload_list = [];
    this.setData({
      optionsId: options.id,
    });
    const { cropperOpt } = this.data;
    this.cropper = new WeCropper(cropperOpt)
      .on("ready", (ctx) => {})
      .on("beforeImageLoad", (ctx) => {
        wx.showToast({
          title: "上传中",
          icon: "loading",
          duration: 20000,
        });
      })
      .on("imageLoad", (ctx) => {
        wx.hideToast();
      });
    //刷新画面
    // this.wecropper.updateCanvas();
    // if (app.globalData.images_upload_list.length < 1) {
    //   this.setData({
    //     we_cropper_active: true,
    //   });
    //   this.uploadTap();
    // }

    this.init();
  },
  next_del() {
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: async (result) => {
        if (result.confirm) {
          let res = await request({
            url: "style_del",
            method: "post",
            data: {
              id: this.data.optionsId,
            },
          });
          if (res.data.error_code === 0) {
            wx.navigateTo({
              url: "/pages/work/index",
              success: (result) => {
                wx.showToast({
                  title: "删除成功",
                  icon: "none",
                });
              },
            });

            console.log(res);
          }
        }
      },
      fail: () => {},
      complete: () => {},
    });
  },
  async next_step() {
    if (this.data.user_id_data_list.length == 0) {
      wx.showToast({
        title: "请上传款式图片",
        icon: "none",
      });
      return;
    }
    if (this.data.stylename == "") {
      wx.showToast({
        title: "请输入名称",
        icon: "none",
      });
      return;
    }
    if (this.data.style_type == "") {
      wx.showToast({
        title: "请输入品类",
        icon: "none",
      });
      return;
    }
    if (this.data.year == "") {
      wx.showToast({
        title: "请输入年份",
        icon: "none",
      });
      return;
    }
    if (this.data.season == "") {
      wx.showToast({
        title: "请输入季节",
        icon: "none",
      });
      return;
    }
    let arr = [];
    arr = this.data.user_id_data_list.map((v, i) => {
      console.log(v);
      if (v.isCheck == true) {
        return { user_id: v.id };
      }
    });
    let picurl1 = "";
    let picurl2 = "";
    if (this.data.images_upload_list.length > 0) {
      picurl1 = this.data.images_upload_list[0].picurl;
    }
    if (this.data.images_upload_list.length > 1) {
      picurl2 = this.data.images_upload_list[1].picurl;
    }
    this.data.images_upload_list[0];
    let data = {};
    data["id"] = this.data.optionsId;
    data["project_id"] = this.data.project_id || 0;
    data["style_pic_url"] = picurl1;
    data["style_color_pic_url"] = picurl2;
    data["stylename"] = this.data.stylename;
    data["styleno"] = this.data.styleno;
    data["season"] = this.data.season;
    data["year"] = this.data.year;
    data["style_type"] = this.data.style_type;
    data["user_id"] = this.data.stylist_id;
    data["designidea"] = this.data.designidea;
    data["user_id_data"] = arr;
    let res = await request({
      url: "style_edit",
      method: "post",
      data,
    });
    console.log(res);
    wx.showToast({
      title: res.data.msg,
      icon: "none",
    });
    if (res.data.error_code == 0) {
      navigateTo(`/pages/work/index`);
    }
  },
  go_select() {
    navigateTo(`/pages/selectStyle/index?tab=1`);
  },
  go_assist() {
    navigateTo(`/pages/selectStyle/index?tab=2`);
  },
  init() {
    let token = wx.getStorageSync("token");
    if (!token) {
      navigateTo(`/pages/login/index`);
      return;
    }
    let level = wx.getStorageSync("level");
    this.setData({
      level,
    });
    this.get_project();
    this.get_style_type();
    this.get_year();
    this.get_season();
    this.get_stylist();
    // this.getStyleno();
    this.init_style();
  },
  async init_style() {
    let res = await request({
      url: "get_style",
      method: "post",
      data: { id: this.data.optionsId },
    });
    console.log(res);
    if (res.data.data.style_pic_url != "") {
      this.data.images_upload_list.push({
        picurl: res.data.data.style_pic_url,
      });
    }
    if (res.data.data.style_color_pic_url != "") {
      this.data.images_upload_list.push({
        picurl: res.data.data.style_color_pic_url,
      });
    }
    let projectname = "";
    this.data.project_list.map((v, i) => {
      if (res.data.data.project_id == v.id) {
        projectname = v.projectname;
      }
    });

    this.data.stylist_list.map((v, i) => {
      res.data.data.user_id_data.map((v1, i1) => {
        if (v.id == v1.user_id) {
          v.isCheck = true;
        }
      });
    });

    getApp().globalData.images_upload_list = this.data.images_upload_list;
    getApp().globalData.designation = res.data.data.stylename;
    getApp().globalData.cursor = res.data.data.designidea.length;
    getApp().globalData.styleno = res.data.data.styleno;
    getApp().globalData.project = projectname;
    getApp().globalData.project_id = res.data.data.project_id;
    getApp().globalData.style_type = res.data.data.style_type;
    getApp().globalData.year = res.data.data.year;
    getApp().globalData.season = res.data.data.season;
    getApp().globalData.stylist = res.data.data.user_name;
    getApp().globalData.stylist_id = res.data.data.user_id;
    getApp().globalData.user_id_data = this.data.stylist_list;
    getApp().globalData.designidea = res.data.data.designidea;

    this.setData({
      user_id_data: this.data.stylist_list,
      designidea: res.data.data.designidea,
      cursor: res.data.data.designidea.length,
      images_upload_list: this.data.images_upload_list,
      styleno: res.data.data.styleno,
      stylename: res.data.data.stylename,
      project_id: res.data.data.project_id,
      project: projectname,
      style_type: res.data.data.style_type,
      year: res.data.data.year,
      season: res.data.data.season,
      stylist: res.data.data.user_name,
    });
    let user_id_data_list = [];
    this.data.user_id_data.map((v, i) => {
      if (v.isCheck == true) {
        user_id_data_list.push(v);
      }
    });
    this.setData({
      user_id_data_list,
    });
  },
  get_designidea(e) {
    this.setData({ designidea: e.detail.value, cursor: e.detail.cursor });
    getApp().globalData.designidea = this.data.designidea;
    getApp().globalData.cursor = this.data.cursor;
  },
  image1_close(e) {
    let index = e.currentTarget.dataset.index;
    this.data.images_upload_list.splice(index, 1);
    this.setData({
      images_upload_list: this.data.images_upload_list,
    });
    getApp().globalData.images_upload_list = this.data.images_upload_list;
  },
  image1() {
    this.setData({
      we_cropper_active: true,
    });
    this.uploadTap();
  },
  // async getStyleno() {
  //   let res = await request({ url: "get_styleno" });
  //   this.setData({
  //     styleno: res.data.data.styleno,
  //   });
  //   getApp().globalData.styleno = this.data.styleno;
  // },
  bindStylistSelect(e) {
    this.setData({
      stylist: this.data.stylist_list[e.detail.value].name,
      stylist_id: this.data.stylist_list[e.detail.value].id,
    });
    getApp().globalData.stylist = this.data.stylist;
    getApp().globalData.stylist_id = this.data.stylist_id;
  },
  async get_stylist() {
    let res = await request({
      url: "get_user_select",
      method: "post",
      data: { role_id: 2 },
    });
    res.data.data.map((v, i) => {
      v["isCheck"] = false;
    });
    this.setData({
      stylist_list: res.data.data,
    });
  },
  bindSeasonSelect(e) {
    this.setData({
      season: this.data.season_list[e.detail.value].season,
    });
    getApp().globalData.season = this.data.season;
  },
  async get_season() {
    let res = await request({
      url: "get_season_select",
    });
    this.setData({
      season_list: res.data.data,
    });
  },
  bindYearSelect(e) {
    this.setData({
      year: this.data.year_list[e.detail.value].year,
    });
    getApp().globalData.year = this.data.year;
  },
  async get_year() {
    let res = await request({
      url: "get_year_select",
    });
    this.setData({
      year_list: res.data.data,
    });
  },
  bindProjectSelect(e) {
    this.setData({
      project: this.data.project_list[e.detail.value].projectname,
      project_id: this.data.project_list[e.detail.value].id,
    });
    getApp().globalData.project = this.data.project;
    getApp().globalData.project_id = this.data.project_id;
  },
  async get_project() {
    let res = await request({
      url: "get_project_list",
    });
    this.setData({
      project_list: res.data.data,
    });
  },
  bindCategoryPickerChange: function (e) {
    let style_type = this.data.style_typeList[1][this.data.style_typeIndex[1]];
    this.setData({
      style_type,
    });
    getApp().globalData.style_type = this.data.style_type;
  },
  bindCategoryPickerColumnChange: function (e) {
    var data = {
      style_typeList: this.data.style_typeList,
      style_typeSelece: this.data.style_typeSelece,
      style_typeIndex: this.data.style_typeIndex,
    };
    data.style_typeIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      if (data.style_typeIndex[0] == e.detail.value) {
        data.style_typeList[1] = this.data.style_types[
          e.detail.value
        ].children.map((v, i) => {
          return v.style_type;
        });
      }
    }
    this.setData(data);
  },
  async get_style_type() {
    let res = await request({
      url: "get_style_type_select",
    });
    let style_types = res.data.data;
    this.data.style_typeList[0] = style_types.map((v) => {
      return v.style_type;
    });
    this.data.style_typeList[1] = style_types[0].children.map((v, i) => {
      return v.style_type;
    });
    this.setData({
      style_typeList: this.data.style_typeList,
      style_types,
    });
  },
  touchStart(e) {
    this.cropper.touchStart(e);
  },
  touchMove(e) {
    this.cropper.touchMove(e);
  },
  touchEnd(e) {
    this.cropper.touchEnd(e);
  },
  closeTap() {
    this.setData({
      we_cropper_active: false,
      focus: true,
    });
  },
  uploadTap() {
    const self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];
        self.wecropper.pushOrign(src);
      },
    });
  },
  getCropperImage() {
    let that = this;
    wx.showToast({
      title: "上传中",
      icon: "loading",
      duration: 20000,
    });
    // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
    this.wecropper.getCropperImage((src) => {
      if (src) {
        wx.uploadFile({
          url: `${url}/uploadpic.php`,
          filePath: src,
          name: "file",
          formData: {
            user: "test",
          },
          success(res) {
            let data = JSON.parse(res.data);
            if (data.error_code === 0) {
              that.data.images_upload_list.push({
                picurl: data.data.pic_file_url,
              });
              that.setData({
                focus: true,
                images_upload_list: that.data.images_upload_list,
                we_cropper_active: false,
              });
              getApp().globalData.cursimages_upload_listor =
                that.data.images_upload_list;
              wx.showToast({
                title: data.msg,
                duration: 1500,
                mask: true,
              });
              wx.hideToast();
            }
          },
        });
      } else {
      }
    });
  },
  onReady: function () {},

  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
