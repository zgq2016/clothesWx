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
        x: (width - 250) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
        y: height * 0.5 - 250 * 0.5, // 裁剪框y轴期起点
        width: 250, // 裁剪框宽度
        height: 250, // 裁剪框高度
      },
    },
    /**
     * 第一部
     */
    words_result: [],
    tempFilePaths: "",
    class_names: [],
    classname: "",
    cardpicurl: "",
    materials_class_id: "",
    companyname: "",
    address: "",
    contact: [
      {
        phone: "",
      },
    ],
    contact_length: "",
    alias_name: "",
    cursor: "",
    bank: [
      {
        bank: "",
        name: "",
        bankid: "",
      },
    ],

    /**
     * 第二部
     */
    alias_name: "",
    remarks: "",
    bank_names: [],
    options_back: 0,
  },
  //options(Object)
  onLoad: function (options) {
    this.setData({ options_back: options.back - 0 });
    console.log(this.data.options_back);
    this.getMaterialSelect();
    this.getBankSelect();
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
  closeTap() {
    this.setData({
      we_cropper_active: false,
    });
  },
  go_second_step() {
    if (
      this.data.materials_class_id !== "" &&
      this.data.cardpicurl !== "" &&
      this.data.companyname !== "" &&
      this.data.address !== "" &&
      this.data.contact !== []
    ) {
      this.setData({
        step_status: 1,
        focus: true,
      });
    } else {
      wx.showToast({
        title: "填充数据",
      });
    }
  },
  go_first_step() {
    this.setData({
      step_status: 0,
    });
  },

  async affirm() {
    let data = {};
    data["materials_class_id"] = this.data.materials_class_id;
    data["companyname"] = this.data.companyname;
    data["cardpicurl"] = this.data.cardpicurl;
    data["contact"] = this.data.contact;
    data["address"] = this.data.address;
    data["alias_name"] = this.data.alias_name;
    data["bank"] = this.data.bank;
    data["remarks"] = this.data.remarks;
    data["orcurl"] = this.data.tempFilePaths;
    let res = await request({
      url: "supplier_add",
      method: "post",
      data,
    });
    wx.showToast({
      title: res.data.msg,
      icon: "",
      duration: 1500,
      mask: true,
    });
    if (res.data.error_code === 0) {
      if (this.data.options_back == 1) {
        wx.navigateBack({
          delta: 1,
        });
      } else {
        navigateTo(`/pages/supplier/index`);
      }
    }
  },
  /**
   * 第二部
   */
  handle_name_be(e) {
    this.data.bank.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.name = e.detail.value;
      }
    });
    this.setData({
      bank: this.data.bank,
    });
  },
  handle_bandid_be(e) {
    this.data.bank.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.bankid = e.detail.value;
      }
    });
    this.setData({
      bank: this.data.bank,
    });
  },
  bank_increase() {
    this.data.bank.push({
      bank: "",
      name: "",
      bankid: "",
    });
    this.setData({
      bank: this.data.bank,
    });
  },
  close_bank_increase(e) {
    this.data.bank.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      bank: this.data.bank,
    });
  },
  get_Conme_be(e) {
    this.setData({
      alias_name: e.detail.value,
    });
  },
  get_remark_be(e) {
    this.setData({
      remarks: e.detail.value,
      cursor: e.detail.cursor,
    });
  },
  bindBankSelect: function (e) {
    this.data.bank.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.bank = this.data.bank_names[e.detail.value].name;
      }
    });
    this.setData({
      bank: this.data.bank,
    });
  },
  async getBankSelect() {
    let res = await request({
      url: "get_bank_name_select",
    });
    let bank_names = res.data.data;
    this.setData({
      bank_names,
    });
  },
  /**
   * 第一步
   */

  get_phone_be(e) {
    this.data.contact.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.phone = e.detail.value;
      }
    });
    this.setData({
      contact: this.data.contact,
    });
  },
  close_phone_be_nothing(e) {
    let { index } = e.target.dataset;
    this.data.contact.splice(index, 1);
    this.setData({
      contact: this.data.contact,
    });
  },
  phone_be_nothing() {
    this.data.contact.push({
      phone: "",
    });
    this.setData({
      contact: this.data.contact,
    });
  },
  get_address_be(e) {
    this.setData({
      address: e.detail.value,
    });
  },
  get_COHR_be(e) {
    this.setData({
      companyname: e.detail.value,
    });
  },
  get_cardpicurl_image() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 0,
    });
    this.uploadTap();
  },
  async Image_recognition_content() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 1,
    });
    this.uploadTap();
  },

  async getMaterialSelect() {
    let res = await request({
      url: "get_materials_class",
    });
    let class_names = res.data.data.map((v) => {
      return {
        classname: v.classname,
        id: v.id,
      };
    });
    this.setData({
      class_names,
    });
  },
  bindClassNameSelect: function (e) {
    this.setData({
      classname: this.data.class_names[e.detail.value].classname,
      materials_class_id: this.data.class_names[e.detail.value].id,
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
        if (this.data.we_cropper_active_status == 0) {
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
                  cardpicurl: data.data.pic_file_url,
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
        if (this.data.we_cropper_active_status == 1) {
          wx.uploadFile({
            url: `${url}/uploadpic.php`,
            filePath: src,
            name: "file",
            formData: {
              user: "test",
            },
            async success(res) {
              console.log(res);
              let data1 = JSON.parse(res.data);
              if (data1.error_code === 0) {
                let res1 = await request({
                  url: "basicGeneral",
                  data: {
                    url: data1.data.pic_file_url,
                  },
                  method: "post",
                });
                console.log(res1);
                if (res1.data.error_code === 0) {
                  that.pregAddress(res1.data.data.words_result);
                  that.pregPhone(res1.data.data.words_result);
                  that.setData({
                    words_result: res1.data.data.words_result,
                    tempFilePaths: data1.data.pic_file_url,
                    we_cropper_active: false,
                  });
                  wx.showToast({
                    title: res1.data.msg,
                    duration: 1500,
                    mask: true,
                  });
                  wx.hideToast();
                }
              }
            },
          });
        }
      } else {
      }
    });
  },
  pregPhone(words) {
    let result = [];
    words.map((v, i) => {
      let res = v.words.match(/1[3456789][0-9]{9}/g);
      if (res != null && res.length > 0) {
        res.map((v1, i1) => {
          result.push({
            contacts: "手机",
            phone: v1,
          });
        });
      }
      let res1 = v.words.match(/0[0-9]{2,3}-[2-9][0-9]{6,7}/g);
      if (res1 != null && res1.length > 0) {
        res1.map((v1, i1) => {
          result.push({
            contacts: v.words.slice(0, 2),
            phone: v1,
          });
        });
      }
    });
    if (result.length == 0) {
      result.push({ contacts: "", phone: '' });
    }
    this.setData({
      contact: result,
    });
  },
  pregAddress(words) {
    let result = "";
    words.map((v, i) => {
      let res = v.words.match(/(地址:?)?([\u4e00-\u9fa5]+[省市区城楼].+)/);
      if (res != null && res.length > 0) {
        result = res[res.length - 1];
      }
    });
    this.setData({
      address: result,
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
