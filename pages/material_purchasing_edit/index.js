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
    options_materials_id: "",
    options_style_id: "",
    materials_obj: {},
    supplier_obj: {},
    account_select: [],
    account_name: "",
    ware: [],
    ware_name: "",
    warehouse: "",
    cursor: "",
    form: {
      dosage: "",
      amountPurchased: "",
      purchasePrice: "",
      money: "",
      payment: 0,
      deposit: "",
      balance_account_id: "",
      finishTime: "",
      storehouse_id: "",
      remark: "",
      picurl: "",
      id: "",
    },
    we_cropper_active_status: "",
    cropperOpt: {
      id: "cropper",
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 150) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: height * 0.5 - 150 * 0.5, // 裁剪框y轴期起点
        width: 150, // 裁剪框宽度
        height: 150, // 裁剪框高度
      },
    },
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({
      options_materials_id: options.materials_id - 0,
      options_style_id: options.style_id - 0,
      ["form.id"]: options.id - 0,
      focus: true,
    });
    this.init();
    this.getBalanceAccount();
    this.getWare();
    this.get_style_purchase_info();
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
  get_designidea(e) {
    this.setData({ ["form.remark"]: e.detail.value, cursor: e.detail.cursor });
  },
  async affirm() {
    if (!this.data.form.dosage) {
      wx.showToast({
        title: "用量",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.amountPurchased) {
      wx.showToast({
        title: "采购量",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.purchasePrice) {
      wx.showToast({
        title: "采购单价",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.money) {
      wx.showToast({
        title: "金额",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.deposit && this.data.form.payment == 0) {
      wx.showToast({
        title: "订金",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.balance_account_id) {
      wx.showToast({
        title: "结算账户",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.finishTime) {
      wx.showToast({
        title: "选择日期",
        icon: "none",
      });
      return;
    }
    if (!this.data.form.storehouse_id) {
      wx.showToast({
        title: "仓库",
        icon: "none",
      });
      return;
    }
    if (form.payment == 1) {
      this.setData({
        ["form.deposit"]: form.money,
      });
    }
    let res = await request({
      url: "purchase_edit",
      method: "post",
      data: this.data.form,
    });
    wx.showToast({
      title: res.data.msg,
      icon: "none",
    });
    if (res.data.error_code == 0) {
      navigateTo(
        `/pages/exploitStatus/index?id=${
          this.data.options_style_id
        }&navScrollLeft=${2 * 375}&currentTab=${2}`
      );
    }
  },
  get_dosage(e) {
    this.setData({
      ["form.dosage"]: e.detail.value - 0,
    });
  },
  get_amountPurchased(e) {
    this.setData({
      ["form.amountPurchased"]: e.detail.value - 0,
    });
  },
  get_purchasePrice(e) {
    this.setData({
      ["form.purchasePrice"]: e.detail.value - 0,
    });
    if (this.data.form.amountPurchased != "") {
      this.setData({
        ["form.money"]: e.detail.value * this.data.form.amountPurchased,
      });
    }
  },
  get_money(e) {
    this.setData({
      ["form.money"]: e.detail.value - 0,
    });
  },
  get_payment(e) {
    this.setData({ ["form.payment"]: e.detail.value - 0 });
    if (this.data.form.payment == 1) {
      this.setData({
        ["form.deposit"]: this.data.form.money,
      });
    } else {
      this.setData({
        ["form.deposit"]: "",
      });
    }
  },
  get_deposit(e) {
    this.setData({ ["form.deposit"]: e.detail.value - 0 });
  },
  async getBalanceAccount() {
    let res = await request({
      url: "balance_account_select",
      method: "post",
      data: { type: 1 },
    });
    this.setData({ account_select: res.data.data });
  },
  async getWare() {
    let res = await request({
      url: "storehouse_list",
      method: "post",
      data: { page: 1, page_size: 999, state: 1, storehouse_type: 1 },
    });
    this.setData({ ware: res.data.data });
  },
  bindDateChange(e) {
    this.setData({
      ["form.finishTime"]: e.detail.value,
    });
  },
  bindAccount_nameSelect(e) {
    this.setData({
      ["form.balance_account_id"]: this.data.account_select[e.detail.value].id,
      account_name: this.data.account_select[e.detail.value].account_name,
    });
  },
  bindWareSelect(e) {
    this.setData({
      ["form.storehouse_id"]: this.data.ware[e.detail.value].id,
      ware_name: this.data.ware[e.detail.value].storehouse_name,
    });
  },
  get_remarks(e) {
    this.setData({
      ["form.remark"]: e.detail.value,
      cursor: e.detail.cursor,
    });
  },
  async get_style_purchase_info() {
    let res = await request({
      url: "get_style_purchase_info",
      method: "post",
      data: { id: this.data.form.id },
    });
    if (res.data.data.payment == 0) {
      this.setData({
        ["form.deposit"]: res.data.data.deposit,
      });
    }
    if (res.data.data.payment == 1) {
      this.setData({
        ["form.deposit"]: res.data.data.totalprice,
      });
    }
    let index = 0;
    this.data.account_select.map((v, i) => {
      console.log(v);
      if (v.id == res.data.data.balance_account_id) {
        index = i;
      }
    });
    this.data.ware.map((v, i) => {
      console.log(v);
      if (v.id == res.data.data.storehouse_id) {
        index = i;
      }
    });
    this.setData({
      ["form.picurl"]: res.data.data.picurl,
      ["form.remark"]: res.data.data.remark,
      cursor: res.data.data.remark.length,
      ["form.dosage"]: res.data.data.actualusage,
      ["form.amountPurchased"]: res.data.data.quantity,
      ["form.purchasePrice"]: res.data.data.price,
      ["form.money"]: res.data.data.totalprice,
      ["form.payment"]: res.data.data.payment,
      ["form.balance_account_id"]: res.data.data.balance_account_id,
      ["form.finishTime"]: res.data.data.finishTime,
      ["form.storehouse_id"]: res.data.data.storehouse_id,
      account_name: this.data.account_select[index].account_name,
      ware_name: this.data.ware[index].storehouse_name,
    });
  },
  async init() {
    let res = await request({
      url: "get_materials_info",
      method: "post",
      data: {
        id: this.data.options_materials_id,
      },
    });
    this.setData({
      materials_obj: res.data.data,
    });
    let res1 = await request({
      url: "get_supplier_info",
      method: "post",
      data: {
        id: this.data.materials_obj.materials_supplier_data[0].supplier_id - 0,
      },
    });
    this.setData({
      supplier_obj: res1.data.data,
    });
  },
  Iamge() {
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
              that.setData({
                ["form.picurl"]: data.data.pic_file_url,
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
    });
  },
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
