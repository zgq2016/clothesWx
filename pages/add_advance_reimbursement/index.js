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

    options_type: "",
    account_select: [],
    user_select: [],
    type_select: [],
    pay_form: {
      money: "",
      account_name: "",
      account_id: "",
      auth_name: "",
      auth_id: "",
      balance: "",
      reason: "",
      cursor: "",
      type: 0,
    },
    re_form: {
      money: "",
      account_name: "",
      account_id: "",
      auth_name: "",
      auth_id: "",
      balance: "",
      reason: "",
      cursor: "",
      type: 1,
      picurl: "",
      business_time: "",
      account_type_id: "",
      account_type_name: "",
    },
  },
  onShow: function () {
    if (this.data.options_type == 0) {
      let money = app.globalData.pay_form.money;
      this.setData({
        ["pay_form.money"]: money,
      });
    }
    if (this.data.options_type == 1) {
      let money = app.globalData.re_form.money;
      this.setData({
        ["re_form.money"]: money,
      });
    }
  },
  //options(Object)
  onLoad: function (options) {
    console.log(options.type);
    app.globalData.pay_form.money = "";
    app.globalData.pay_form.reason = "";
    app.globalData.pay_form.cursor = "";
    app.globalData.pay_form.account_name = "";
    app.globalData.pay_form.account_id = "";
    app.globalData.pay_form.balance = "";
    app.globalData.pay_form.auth_name = "";
    app.globalData.pay_form.auth_id = "";

    app.globalData.re_form.money = "";
    app.globalData.re_form.reason = "";
    app.globalData.re_form.cursor = "";
    app.globalData.re_form.account_name = "";
    app.globalData.re_form.account_id = "";
    app.globalData.re_form.balance = "";
    app.globalData.re_form.auth_name = "";
    app.globalData.re_form.auth_id = "";
    app.globalData.re_form.picurl = "";
    app.globalData.re_form.business_time = "";
    app.globalData.re_form.account_type_id = "";
    app.globalData.re_form.account_type_name = "";

    this.setData({ options_type: options.type });
    getApp().globalData.re_form.business_time = this.data.re_form.business_time;

    this.get_user();
    this.balance_account();
    this.account_type();
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
  },
  async next_step_reimbursement() {
    if (this.data.re_form.account_name == "") {
      wx.showToast({
        title: "结算账户",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.account_type_name == "") {
      wx.showToast({
        title: "账目类型",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.money == "") {
      wx.showToast({
        title: "报销金额",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.business_time == "") {
      wx.showToast({
        title: "业务时间",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.auth_name == "") {
      wx.showToast({
        title: "审批人",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.reason == "") {
      wx.showToast({
        title: "事由",
        icon: "none",
      });
      return;
    }
    if (this.data.re_form.picurl == "") {
      wx.showToast({
        title: "附图",
        icon: "none",
      });
      return;
    }
    let res = await request({
      url: "advance_reimbursement_add",
      method: "post",
      data: this.data.re_form,
    });
    if (res.data.error_code == 0) {
      navigateTo(`/pages/advance_reimbursement/index`);
    }
  },
  async next_step_advance() {
    if (this.data.pay_form.account_name == "") {
      wx.showToast({
        title: "结算账户",
        icon: "none",
      });
      return;
    }
    if (this.data.pay_form.money == "") {
      wx.showToast({
        title: "预支金额",
        icon: "none",
      });
      return;
    }
    if (this.data.pay_form.auth_name == "") {
      wx.showToast({
        title: "审批人",
        icon: "none",
      });
      return;
    }
    if (this.data.pay_form.reason == "") {
      wx.showToast({
        title: "事由",
        icon: "none",
      });
      return;
    }
    let res = await request({
      url: "advance_reimbursement_add",
      method: "post",
      data: this.data.pay_form,
    });
    if (res.data.error_code == 0) {
      navigateTo(`/pages/advance_reimbursement/index`);
    }
  },
  bindDateChange: function (e) {
    this.setData({
      ["re_form.business_time"]: e.detail.value,
    });
    getApp().globalData.re_form.business_time = this.data.re_form.business_time;
  },
  bindTypeSelect(e) {
    this.setData({
      ["re_form.account_type_id"]: this.data.type_select[e.detail.value].id,
      ["re_form.account_type_name"]: this.data.type_select[e.detail.value]
        .account_type_name,
    });
    getApp().globalData.re_form.account_type_id = this.data.re_form.account_type_id;
    getApp().globalData.re_form.account_type_name = this.data.re_form.account_type_name;
  },
  get_reason(e) {
    if (this.data.options_type == 0) {
      this.setData({
        ["pay_form.reason"]: e.detail.value,
        ["pay_form.cursor"]: e.detail.cursor,
      });
      getApp().globalData.pay_form.reason = this.data.pay_form.reason;
      getApp().globalData.pay_form.cursor = this.data.pay_form.cursor;
    }
    if (this.data.options_type == 1) {
      this.setData({
        ["re_form.reason"]: e.detail.value,
        ["re_form.cursor"]: e.detail.cursor,
      });
      getApp().globalData.re_form.reason = this.data.re_form.reason;
      getApp().globalData.re_form.cursor = this.data.re_form.cursor;
    }
  },
  bindAccountSelect(e) {
    if (this.data.options_type == 0) {
      this.setData({
        ["pay_form.account_name"]: this.data.account_select[e.detail.value]
          .account_name,
        ["pay_form.account_id"]: this.data.account_select[e.detail.value].id,
        ["pay_form.balance"]: this.data.account_select[e.detail.value].balance,
      });
      getApp().globalData.pay_form.account_name = this.data.pay_form.account_name;
      getApp().globalData.pay_form.account_id = this.data.pay_form.account_id;
      getApp().globalData.pay_form.balance = this.data.pay_form.balance;
    }
    if (this.data.options_type == 1) {
      console.log(1);
      this.setData({
        ["re_form.account_name"]: this.data.account_select[e.detail.value]
          .account_name,
        ["re_form.account_id"]: this.data.account_select[e.detail.value].id,
        ["re_form.balance"]: this.data.account_select[e.detail.value].balance,
      });
      getApp().globalData.re_form.account_name = this.data.re_form.account_name;
      getApp().globalData.re_form.account_id = this.data.re_form.account_id;
      getApp().globalData.re_form.balance = this.data.re_form.balance;
    }
  },
  bindUserSelect(e) {
    if (this.data.options_type == 0) {
      this.setData({
        ["pay_form.auth_name"]: this.data.user_select[e.detail.value].name,
        ["pay_form.auth_id"]: this.data.user_select[e.detail.value].id,
      });
      getApp().globalData.pay_form.auth_name = this.data.pay_form.auth_name;
      getApp().globalData.pay_form.auth_id = this.data.pay_form.auth_id;
    }
    if (this.data.options_type == 1) {
      this.setData({
        ["re_form.auth_name"]: this.data.user_select[e.detail.value].name,
        ["re_form.auth_id"]: this.data.user_select[e.detail.value].id,
      });
      getApp().globalData.re_form.auth_name = this.data.re_form.auth_name;
      getApp().globalData.re_form.auth_id = this.data.re_form.auth_id;
    }
  },
  async balance_account() {
    let res = await request({
      url: "balance_account_select",
      method: "post",
      data: { type: 1 },
    });
    this.setData({
      account_select: res.data.data,
    });
  },
  async account_type() {
    let res = await request({
      url: "account_type_select",
    });
    this.setData({
      type_select: res.data.data,
    });
  },
  async get_user() {
    let res = await request({
      url: "get_user_select",
      method: "post",
      data: { is_manager: 1 },
    });
    this.setData({
      user_select: res.data.data,
    });
  },
  go_select() {
    navigateTo(`/pages/selectStyle/index?tab=9`);
  },
  go_select1() {
    navigateTo(`/pages/selectStyle/index?tab=10`);
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
                ["re_form.picurl"]: picurl,
                we_cropper_active: false,
                focus: true,
              });
              getApp().globalData.re_form.picurl = picurl;
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
