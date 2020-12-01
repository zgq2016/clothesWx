import { request } from "../../request/index.js";
import { url } from "../../request/url.js";
import navigateTo from "../../utils/navigateRoute.js";
import WeCropper from "../../components/we-cropper/we-cropper.js";
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio;
const height = device.windowHeight - 70;
const fs = (width / 750) * 2;
Page({
  data: {
    we_cropper_active_status: "",
    we_cropper_active: false,
    cropperOpt: {
      id: "cropper",
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 250) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: height * 0.5 - 250 * 0.5, // 裁剪框y轴期起点
        width: 250, // 裁剪框宽度
        height: 250, // 裁剪框高度
      },
    },

    options_id: "",
    style_id: "",
    status: "",
    portion_form: {
      quantity: "",
      amount: "",
      returntime: "",
      picurl: "",
    },
    all_form: {
      amount: "",
      picurl: "",
    },
    delay_form: {
      returntime: "",
      remarks: "",
    },
    cursor: "",
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({
      options_id: options.id - 0,
      style_id: options.style_id - 0,
      status: options.status - 0,
      focus: true,
    });
    if (this.data.status == 3) {
      this.setData({
        options_id: options.id - 0,
        style_id: options.style_id - 0,
        status: options.status - 0,
        quantity: options.quantity - 0,
        balance: options.balance - 0,
        paid_money: options.paid_money - 0,
        price: options.price - 0,
        totalprice: options.totalprice - 0,
      });
    }
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
    this.wecropper.updateCanvas(); //刷新画面
  },

  async delay_form_step() {
    if (!this.data.delay_form.remarks) {
      wx.showToast({
        title: "原因",
        icon: 'none',
      });
      return;
    }
    if (!this.data.delay_form.returntime) {
      wx.showToast({
        title: "选择日期",
        icon: 'none',
      });
      return;
    }
    let data = {};
    data = this.data.portion_form;
    data["state"] = "3";
    data["remarks"] = "";
    data["logname"] = "延迟回料";
    data["quantity"] = 0;
    data["amount"] = 0;
    data["style_purchase_id"] = this.data.options_id;
    let res = await request({
      url: "style_purchase_log_add",
      method: "post",
      data,
    });
    console.log(res);
    navigateTo(
      `/pages/exploitStatus/index?id=${this.data.style_id}&navScrollLeft=${
        2 * 375
      }&currentTab=${2}`
    );
  },
  get_delay_date(e) {
    this.setData({ ["delay_form.returntime"]: e.detail.value });
  },
  get_delay_remarks(e) {
    this.setData({
      ["delay_form.remarks"]: e.detail.value,
      cursor: e.detail.cursor,
    });
  },
  async all_form_step() {
    console.log();
    if (!this.data.all_form.amount) {
      wx.showToast({
        title: "结算金额",
        icon: 'none',
      });
      return;
    }
    if (!this.data.all_form.picurl) {
      wx.showToast({
        title: "上传凭证",
        icon: 'none',
      });
      return;
    }

    let data = {};
    data = this.data.all_form;
    data["state"] = "4";
    data["remarks"] = "";
    data["logname"] = "全部回料";
    data["returntime"] = "";
    data["quantity"] = 0;
    data["style_purchase_id"] = this.data.options_id;
    let res = await request({
      url: "style_purchase_log_add",
      method: "post",
      data,
    });
    console.log(res);
    navigateTo(
      `/pages/exploitStatus/index?id=${this.data.style_id}&navScrollLeft=${
        2 * 375
      }&currentTab=${2}`
    );
  },
  get_all_amount(e) {
    if (e.detail.value != this.data.totalprice - this.data.paid_money) {
      wx.showToast({
        title: "余结金额不匹配",
        icon: "none",
      });
    }
    this.setData({ ["all_form.amount"]: e.detail.value });
  },
  get_all_picurl() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 3,
    });
    this.uploadTap();
  },

  async portion_form_step() {
    if (!this.data.portion_form.quantity) {
      wx.showToast({
        title: "回料数量",
        icon: 'none',
      });
      return;
    }
    if (!this.data.portion_form.amount) {
      wx.showToast({
        title: "结算金额",
        icon: 'none',
      });
      return;
    }
    if (!this.data.portion_form.returntime) {
      wx.showToast({
        title: "结算金额",
        icon: 'none',
      });
      return;
    }
    if (!this.data.portion_form.returntime) {
      wx.showToast({
        title: "选择日期",
        icon: 'none',
      });
      return;
    }
    let data = {};
    data = this.data.portion_form;
    data["state"] = "2";
    data["remarks"] = "";
    data["logname"] = "部分回料";
    data["style_purchase_id"] = this.data.options_id;
    let res = await request({
      url: "style_purchase_log_add",
      method: "post",
      data,
    });
    console.log(res);
    navigateTo(
      `/pages/exploitStatus/index?id=${this.data.style_id}&navScrollLeft=${
        2 * 375
      }&currentTab=${2}`
    );
  },
  get_portion_quantity(e) {
    this.setData({ ["portion_form.quantity"]: e.detail.value });
  },
  get_portion_amount(e) {
    this.setData({ ["portion_form.amount"]: e.detail.value });
  },

  get_portion_date(e) {
    this.setData({ ["portion_form.returntime"]: e.detail.value });
  },
  get_portion_picurl() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 1,
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
        if (that.data.we_cropper_active_status == 1) {
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
                that.setData({
                  ["portion_form.picurl"]: data.data.pic_file_url,
                  we_cropper_active: false,
                });
                wx.showToast({
                  title: data.msg,
                  duration: 1500,
                  mask: true,
                });
                wx.hideToast();
              }
            },
          });
        }
        if (that.data.we_cropper_active_status == 3) {
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
                that.setData({
                  ["all_form.picurl"]: data.data.pic_file_url,
                  we_cropper_active: false,
                });
                wx.showToast({
                  title: data.msg,
                  duration: 1500,
                  mask: true,
                });
                wx.hideToast();
              }
            },
          });
        }
      }
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
