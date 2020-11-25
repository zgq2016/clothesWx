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
        x: (width - 340) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: height * 0.5 - 187 * 0.5, // 裁剪框y轴期起点
        width: 340, // 裁剪框宽度
        height: 187, // 裁剪框高度
      },
    },

    picurl: "",
    projecttypes: [
      {
        projecttype: "意向",
        id: 0,
      },
      {
        projecttype: "阶段",
        id: 1,
      },
      {
        projecttype: "企划",
        id: 2,
      },
    ],
    projecttypenum: "",
    companynames_list: [],
    companynames: "",
    year_list: [],
    year: "",
    season_list: [],
    season: "",
    date: "",
    stylist_list: [],
    stylist: "",
    stylist_id: "",

    designidea: "",
    cursor: "",
    projectname: "",
    companynames_id: "",
    element: "",
    claim_num: "",
    optionsId: "",
    user_id_data: [],
    user_id_data_list: [],
    permission: [],
    designatorAssignment: "",
    assignmentAssistance: "",
    user_level: "",
  },
  //options(Object)
  onShow: function () {
    let project_name = app.globalData.project.project_name;
    let element = app.globalData.project.element;
    let color_no = app.globalData.project.color_no;
    let claim_num = app.globalData.project.claim_num;
    let user_id_data = app.globalData.project.user_id_data;
    let designidea = app.globalData.project.designidea;
    let cursor = app.globalData.project.cursor;
    let user_id_data_list = [];
    user_id_data.map((v, i) => {
      if (v.isCheck == true) {
        user_id_data_list.push(v);
      }
    });
    this.setData({
      projectname: project_name,
      element,
      color_no,
      claim_num,
      user_id_data,
      user_id_data_list,
      user_id_data,
      designidea,
      cursor,
    });
  },
  onLoad: function (options) {
    let permission = wx.getStorageSync("permission").split(",");
    let user_level = wx.getStorageSync("level");
    let designatorAssignment = permission.indexOf("designatorAssignment") != -1;
    let assignmentAssistance = permission.indexOf("assignmentAssistance") != -1;
    // app.globalData.designation = "";
    app.globalData.project.designidea = "";
    app.globalData.project.cursor = "";
    app.globalData.project.picurl = "";
    app.globalData.project.project_name = "";
    app.globalData.project.projecttype = "";
    app.globalData.project.projecttypenum = "";
    app.globalData.project.companynames = "";
    app.globalData.project.companynames_id = "";
    app.globalData.project.claim_num = "";
    app.globalData.project.year = "";
    app.globalData.project.season = "";
    app.globalData.project.color_no = "";
    app.globalData.project.element = "";
    app.globalData.project.date = "";
    app.globalData.project.color_no = "";
    app.globalData.project.stylist = "";
    app.globalData.project.stylist_id = "";
    app.globalData.project.user_id_data = [];
    this.setData({
      optionsId: options.id - 0,
      projecttypenum: options.projecttype - 0 || 0,
      designatorAssignment,
      assignmentAssistance,
      user_level,
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
    this.wecropper.updateCanvas();
    this.init();
  },
  init() {
    // this.setData({
    //   projecttype: this.data.projecttypes[this.data.projecttypenum].projecttype,
    // });
    this.get_companynames();
    this.get_year();
    this.get_season();
    this.get_stylist();
    this.project_init();
  },
  go_designidea() {
    navigateTo(`/pages/selectStyle/index?tab=8`);
  },
  async project_init() {
    let res = await request({
      url: "get_project",
      method: "post",
      data: { id: this.data.optionsId },
    });
    this.data.stylist_list.map((v, i) => {
      res.data.data.user_id_data.map((v1, i1) => {
        if (v.id == v1.user_id) {
          v.isCheck = true;
        }
      });
    });
    console.log(this.data.stylist_list);
    let projecttypes_id = res.data.data.projecttype;
    getApp().globalData.project.designidea = res.data.data.detailed;
    getApp().globalData.project.cursor = res.data.data.projectname.length;
    getApp().globalData.project.picurl = res.data.data.picurl;
    getApp().globalData.project.project_name = res.data.data.projectname;
    getApp().globalData.project.projecttype = this.data.projecttypes[
      projecttypes_id
    ].projecttype;
    getApp().globalData.project.projecttypenum = res.data.data.projecttype - 0;
    getApp().globalData.project.companynames =
      res.data.data.customer_companyname;
    getApp().globalData.project.companynames_id = res.data.data.customer_id;
    getApp().globalData.project.claim_num = res.data.data.quantity;
    getApp().globalData.project.year = res.data.data.year;
    getApp().globalData.project.season = res.data.data.season;
    getApp().globalData.project.color_no = res.data.data.color;
    getApp().globalData.project.element = res.data.data.element;
    getApp().globalData.project.date = res.data.data.finishtime;
    getApp().globalData.project.stylist = res.data.data.user_name;
    getApp().globalData.project.stylist_id = res.data.data.user_id;
    getApp().globalData.project.user_id_data = this.data.stylist_list;
    this.setData({
      designidea: res.data.data.detailed,
      cursor: res.data.data.projectname.length,
      picurl: res.data.data.picurl,
      projectname: res.data.data.projectname,
      projecttype: this.data.projecttypes[projecttypes_id].projecttype,
      projecttypenum: res.data.data.projecttype - 0,
      companynames: res.data.data.customer_companyname,
      companynames_id: res.data.data.customer_id,
      claim_num: res.data.data.quantity,
      year: res.data.data.year,
      season: res.data.data.season,
      color_no: res.data.data.color,
      element: res.data.data.element,
      date: res.data.data.finishtime,
      stylist: res.data.data.user_name,
      stylist_id: res.data.data.user_id,
      user_id_data: this.data.stylist_list,
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
  next_del() {
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: async (result) => {
        if (result.confirm) {
          let res = await request({
            url: "project_del",
            method: "post",
            data: {
              id: this.data.optionsId,
            },
          });
          if (res.data.error_code === 0) {
            wx.navigateTo({
              url: "/pages/project/index",
              success: (result) => {
                wx.showToast({
                  title: "删除成功",
                  success: (result) => {},
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
    if (this.data.projectname == "") {
      wx.showToast({
        title: "项目名称",
      });
      return;
    }
    if (this.data.finishtime == "") {
      wx.showToast({
        title: "完成时间",
      });
      return;
    }
    if (this.data.claim_num == "") {
      wx.showToast({
        title: "要求数量",
      });
      return;
    }
    if (this.data.projecttypenum === 0) {
      if (this.data.companynames_id == "") {
        wx.showToast({
          title: "客户",
        });
        return;
      }
      if (this.data.year == "") {
        wx.showToast({
          title: "年份",
        });
        return;
      }
      if (this.data.season == "") {
        wx.showToast({
          title: "季节",
        });
        return;
      }
    }
    if (this.data.projecttypenum === 1) {
      if (this.data.season == "") {
        wx.showToast({
          title: "年份",
        });
        return;
      }
      if (this.data.season == "") {
        wx.showToast({
          title: "季节",
        });
        return;
      }
    }
    if (this.data.projecttypenum === 2) {
      if (this.data.element == "") {
        wx.showToast({
          title: "元素",
        });
        return;
      }
      if (this.data.color_no == "") {
        wx.showToast({
          title: "色系",
        });
        return;
      }
      if (this.data.year == "") {
        wx.showToast({
          title: "年份",
        });
        return;
      }
      if (this.data.season == "") {
        wx.showToast({
          title: "季节",
        });
        return;
      }
    }
    let data = {};
    data["id"] = this.data.optionsId;
    data["projectname"] = this.data.projectname;
    data["projecttype"] = this.data.projecttypenum;
    data["picurl"] = this.data.picurl;
    data["finishtime"] = this.data.date;
    data["quantity"] = this.data.claim_num;
    data["detailed"] = this.data.designidea;
    data["user_id"] = this.data.stylist_id;
    let arr = [];
    arr = this.data.user_id_data_list.map((v, i) => {
      if (v.isCheck == true) {
        return { user_id: v.id };
      }
    });
    data["user_id_data"] = arr;
    if (this.data.projecttypenum === 0) {
      data["customer_id"] = this.data.companynames_id;
      data["year"] = this.data.year;
      data["season"] = this.data.season;
    }
    if (this.data.projecttypenum === 1) {
      data["year"] = this.data.year;
      data["season"] = this.data.season;
    }
    if (this.data.projecttypenum === 2) {
      data["element"] = this.data.element;
      data["color"] = this.data.color_no;
      data["year"] = this.data.year;
      data["season"] = this.data.season;
    }
    let res = await request({
      url: "project_edit",
      data,
      method: "post",
    });
    wx.showToast({
      title: res.data.msg,
      icon: "",
    });
    if (res.data.error_code == 0) {
      navigateTo(`/pages/project/index`);
    }
  },
  go_select() {
    navigateTo(`/pages/selectStyle/index?tab=3`);
  },
  go_element() {
    navigateTo(`/pages/selectStyle/index?tab=4`);
  },
  go_color_no() {
    navigateTo(`/pages/selectStyle/index?tab=5`);
  },
  go_claim_num() {
    navigateTo(`/pages/selectStyle/index?tab=6`);
  },
  go_assist() {
    navigateTo(`/pages/selectStyle/index?tab=7`);
  },
  get_designidea(e) {
    this.setData({ designidea: e.detail.value, cursor: e.detail.cursor });
    getApp().globalData.project.designidea = this.data.designidea;
    getApp().globalData.project.cursor = this.data.cursor;
  },
  bindStylistSelect(e) {
    this.setData({
      stylist: this.data.stylist_list[e.detail.value].name,
      stylist_id: this.data.stylist_list[e.detail.value].id,
    });
    getApp().globalData.project.stylist = this.data.stylist;
    getApp().globalData.project.stylist_id = this.data.stylist_id;
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
    getApp().globalData.project.season = this.data.season;
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
    getApp().globalData.project.date = this.data.date;
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
    getApp().globalData.project.year = this.data.year;
  },
  async get_year() {
    let res = await request({
      url: "get_year_select",
    });
    this.setData({
      year_list: res.data.data,
    });
  },
  bindcompanynamesSelect(e) {
    this.setData({
      companynames: this.data.companynames_list[e.detail.value].companyname,
      companynames_id: this.data.companynames_list[e.detail.value].id,
    });
    getApp().globalData.project.companynames = this.data.companynames;
    getApp().globalData.project.companynames_id = this.data.companynames_id;
  },
  async get_companynames() {
    let res = await request({
      url: "get_customer_select",
    });
    this.setData({
      companynames_list: res.data.data,
    });
  },
  bindProjectTypeSelect(e) {
    if (this.data.projecttypenum == 0) {
      this.setData({
        element: "",
        color_no: "",
        year: "",
        season: "",
      });
      getApp().globalData.project.element = "";
      getApp().globalData.project.color_no = "";
      getApp().globalData.project.year = "";
      getApp().globalData.project.season = "";
    }
    if (this.data.projecttypenum == 1) {
      this.setData({
        element: "",
        color_no: "",
        year: "",
        season: "",
        companynames: "",
      });
      getApp().globalData.project.element = "";
      getApp().globalData.project.color_no = "";
      getApp().globalData.project.year = "";
      getApp().globalData.project.season = "";
      getApp().globalData.project.companynames = "";
    }
    if (this.data.projecttypenum == 2) {
      this.setData({
        companynames: "",
        companynames_id: "",
        year: "",
        season: "",
      });
      getApp().globalData.project.companynames = "";
      getApp().globalData.project.companynames_id = "";
      getApp().globalData.project.year = "";
      getApp().globalData.project.season = "";
    }
    this.setData({
      projecttype: this.data.projecttypes[e.detail.value].projecttype,
      projecttypenum: this.data.projecttypes[e.detail.value].id,
    });

    getApp().globalData.project.projecttype = this.data.projecttype;
    getApp().globalData.project.projecttypenum = this.data.projecttypenum;
  },
  image1() {
    this.setData({
      we_cropper_active: true,
    });
    this.uploadTap();
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
              let picurl = data.data.pic_file_url;
              that.setData({
                picurl,
                we_cropper_active: false,
                focus: true,
              });
              getApp().globalData.project.picurl = picurl;
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
