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
    /**
     * 第一步
     */
    id: "",
    colorList: [
      ["无脊柱动物", "脊柱动物", "aa"],
      ["扁性动物", "线形动物", "环节动物", "软体动物", "节肢动物"],
    ],
    colorListSelece: [],
    colorIndex: [0, 0],
    we_cropper_active: false,
    color_data: [],
    color: "",
    picurl: "",
    color_no: "",
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
     * 第二步
     */ goods_length: 1,
    goodsSearch_length: 1,
    goods: [],
    goodsSearch: [],
    companyname: "",
    classify_data: [],
    active: false,
    selectId: "",
    classify1: "",
    classify2: "",
    material_name: "",
    materialsname: "",
    classifyList: [
      ["无脊柱动物", "脊柱动物", "aa"],
      ["扁性动物", "线形动物", "环节动物", "软体动物", "节肢动物"],
    ],
    classifyListSelece: [],
    classifyIndex: [0, 0],
    unit_name: [],
    unit_names: [],
    /**
     * 第三个
     */
    LiningList: [
      {
        content: "",
        id: "",
        material_name: "",
      },
    ],
    materials: [],
    words_result: [],
    tempFilePaths: "",
    materialsno: "",
    breadth_price: "",
    grammage_price: "",
    percent_price: "",
    LiningList_length: "",
    /**
     * 第四个
     */
    radio: "0",
    /**
     * 公共步骤
     */
    we_cropper_active_status: "",
    step_status: 0,
    materials_class_id: 0,
    materials_supplier_id: 0,
    wsale_price: "",
    arrival_time: "",
    remark_price: "",
    cursor: "",
    /**
     * 初始化
     */
    obj: {},
    options_back: 0,
  },
  // 全局 接口参数
  QueryParams: {
    companyname: "",
    id: 0,
    // 页码
    page: 1,
    // 页容量
    page_size: 24,
  },
  // 总页数
  TotalPages: 1,
  onShow: function () {
    this.setData({
      color_data: app.globalData.materialProcess.color_data,
      classify1: app.globalData.materialProcess.classify1,
      classify2: app.globalData.materialProcess.classify2,
      materials_class_id: app.globalData.materialProcess.materials_class_id,
      unit_name: app.globalData.materialProcess.unit_name,
      materialsname: app.globalData.materialProcess.materialsname,
      unit_price: app.globalData.materialProcess.unit_price,
      supplier_item: app.globalData.materialProcess.supplier_item,
      materialsno: app.globalData.materialProcess.materialsno,
      breadth_price: app.globalData.materialProcess.breadth_price,
      grammage_price: app.globalData.materialProcess.grammage_price,
      LiningList: app.globalData.materialProcess.LiningList,
      remark_price: app.globalData.materialProcess.remark_price,
      cursor: app.globalData.materialProcess.cursor,
      radio: app.globalData.materialProcess.radio,
      timer_price: app.globalData.materialProcess.timer_price,
      materials_supplier_id:
        app.globalData.materialProcess.materials_supplier_id,
    });

    this.QueryParams.page = 1;
    this.QueryParams.companyname = "";
    this.setData({
      companyname: "",
    });
    this.setData({
      goods: [],
      goodsSearch: [],
    });
    this.getSupplierList();
  },
  //options(Object)
  onLoad: function (options) {
    app.globalData.materialProcess.color_data = [];
    app.globalData.materialProcess.classify1 = "";
    app.globalData.materialProcess.classify2 = "";
    app.globalData.materialProcess.materials_class_id = "";
    app.globalData.materialProcess.unit_name = "";
    app.globalData.materialProcess.materialsname = "";
    app.globalData.materialProcess.unit_price = "";
    app.globalData.materialProcess.supplier_item = "";
    app.globalData.materialProcess.materialsno = "";
    app.globalData.materialProcess.breadth_price = "";
    app.globalData.materialProcess.grammage_price = "";
    app.globalData.materialProcess.LiningList = [
      {
        content: "",
        id: "",
        material_name: "",
      },
    ];
    app.globalData.materialProcess.remark_price = "";
    app.globalData.materialProcess.cursor = "";
    app.globalData.materialProcess.radio = "";
    app.globalData.materialProcess.timer_price = "";
    app.globalData.materialProcess.materials_supplier_id = "";
    this.setData({
      optionsId: options.id - 0,
      options_back: options.back - 0,
    });

    this.init();
    this.getColorSelect();
    this.getClassnameSelect();
    this.getUnitSelect();
    // this.getMaterialList();

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
  /**
   * 初始化
   */
  async init() {
    let res = await request({
      url: "get_materials_info",
      method: "post",
      data: {
        id: this.data.optionsId,
      },
    });
    let obj = res.data.data;
    console.log(obj.materials_supplier_data[0].supplier_id);
    let arr = [];
    let res1 = await request({
      url: "get_supplier_info",
      method: "post",
      data: {
        id: obj.materials_supplier_data[0].supplier_id,
      },
    });
    arr.push({
      cardpicurl: res1.data.data.cardpicurl,
      companyname: res1.data.data.companyname,
      mainclass: res1.data.data.mainclass,
      materials_class_name: res1.data.data.materials_class_name,
      supplier_contact_data: res1.data.data.contact_data,
    });
    getApp().globalData.materialProcess.color_data = obj.color_data;
    getApp().globalData.materialProcess.classify1 = obj.materials_class_name;
    getApp().globalData.materialProcess.classify2 =
      obj.materials_mainclass_name;
    getApp().globalData.materialProcess.materials_class_id =
      obj.materials_class_id;
    getApp().globalData.materialProcess.unit_name = obj.unit;
    getApp().globalData.materialProcess.materialsname = obj.materialsname;
    getApp().globalData.materialProcess.unit_price = obj.wsale_price;
    getApp().globalData.materialProcess.supplier_item = arr;
    getApp().globalData.materialProcess.materialsno = obj.materialsno;
    getApp().globalData.materialProcess.breadth_price = obj.breadth;
    getApp().globalData.materialProcess.grammage_price = obj.grammage;
    getApp().globalData.materialProcess.LiningList = obj.material_data;
    getApp().globalData.materialProcess.remark_price = obj.remarks;
    getApp().globalData.materialProcess.cursor = obj.remarks.length;
    getApp().globalData.materialProcess.radio = obj.instock;
    getApp().globalData.materialProcess.timer_price = obj.arrival_time;
    getApp().globalData.materialProcess.materials_supplier_id =
      obj.materials_supplier_data[0].supplier_id;
    this.setData({
      color_data: obj.color_data,
      supplier_item: arr,
      materials_supplier_id: obj.materials_supplier_data[0].supplier_id,
      materials_class_id: obj.materials_class_id,
      unit_name: obj.unit,
      materialsname: obj.materialsname,
      unit_price: obj.wsale_price,
      radio: obj.instock,
      timer_price: obj.arrival_time,
      remark_price: obj.remarks,
      materialsno: obj.materialsno,
      breadth_price: obj.breadth,
      grammage_price: obj.grammage,
      LiningList: obj.material_data,
      classify1: obj.materials_class_name,
      classify2: obj.materials_mainclass_name,
    });
  },
  /**
   * 公共步骤
   */
  go_second_step(e) {
    if (e.currentTarget.dataset.num == 0) {
      getApp().globalData.materialProcess.color_data = this.data.color_data;
      if (this.data.color_data.length > 0) {
        this.setData({
          step_status: 1,
        });
      } else {
        wx.showToast({
          title: "请填写数据",
          icon: "none",
        });
      }
    }
    if (e.currentTarget.dataset.num == 1) {
      this.setData({
        step_status: 1,
      });
    }
    wx.pageScrollTo({
      scrollTop: 0,
    });
  },
  go_first_step(e) {
    this.setData({
      step_status: 0,
    });
    wx.pageScrollTo({
      scrollTop: 0,
    });
  },
  go_third_step(e) {
    if (e.currentTarget.dataset.num == 1) {
      getApp().globalData.materialProcess.classify1 = this.data.classify1;
      getApp().globalData.materialProcess.classify2 = this.data.classify2;
      getApp().globalData.materialProcess.materials_class_id = this.data.materials_class_id;
      getApp().globalData.materialProcess.unit_name = this.data.unit_name;
      getApp().globalData.materialProcess.materialsname = this.data.materialsname;
      getApp().globalData.materialProcess.unit_price = this.data.unit_price;
      getApp().globalData.materialProcess.supplier_item = this.data.supplier_item;
      getApp().globalData.materialProcess.materials_supplier_id = this.data.materials_supplier_id;
      if (this.data.classify2 == "辅料") {
        getApp().globalData.materialProcess.materialsno = "";
        getApp().globalData.materialProcess.breadth_price = "";
        getApp().globalData.materialProcess.grammage_price = "";
        getApp().globalData.materialProcess.LiningList = "";
        this.setData({
          step_status: 3,
        });
        return;
      }
      if (
        this.data.materials_supplier_id != "" &&
        this.data.classify1 != "" &&
        this.data.unit_name != "" &&
        this.data.materialsname != "" &&
        this.data.unit_price != ""
      ) {
        this.setData({
          step_status: 2,
        });
      } else {
        wx.showToast({
          title: "请填写数据",
          icon: "none",
        });
      }
    }
    if (e.currentTarget.dataset.num == 0) {
      getApp().globalData.materialProcess.remark_price = this.data.remark_price;
      getApp().globalData.materialProcess.cursor = this.data.cursor;
      getApp().globalData.materialProcess.radio = this.data.radio;
      getApp().globalData.materialProcess.timer_price = this.data.timer_price;
      if (this.data.classify2 == "辅料") {
        this.setData({
          step_status: 1,
        });
        return;
      }
      this.setData({
        step_status: 2,
      });
    }
    wx.pageScrollTo({
      scrollTop: 0,
    });
  },
  go_get_material_name(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.optionsId;
    getApp().globalData.materialProcess.materialsno = this.data.materialsno;
    getApp().globalData.materialProcess.breadth_price = this.data.breadth_price;
    getApp().globalData.materialProcess.grammage_price = this.data.grammage_price;
    getApp().globalData.materialProcess.LiningList = this.data.LiningList;
    navigateTo(
      `/pages/materialProcess_go/index?id=${id}&index=${index}&type=${"edit"}`
    );
  },
  go_four_step(e) {
    if (e.currentTarget.dataset.num == 2) {
      getApp().globalData.materialProcess.materialsno = this.data.materialsno;
      getApp().globalData.materialProcess.breadth_price = this.data.breadth_price;
      getApp().globalData.materialProcess.grammage_price = this.data.grammage_price;
      getApp().globalData.materialProcess.LiningList = this.data.LiningList;
      if (
        this.data.materialsno != "" &&
        this.data.breadth_price != "" &&
        this.data.LiningList.length != []
      ) {
        this.setData({
          step_status: 3,
          focus: true,
        });
      } else {
        wx.showToast({
          title: "请填写数据",
          icon: "none",
        });
      }
    }
    if (e.currentTarget.dataset.num == 0) {
      this.setData({
        step_status: 3,
      });
    }
    wx.pageScrollTo({
      scrollTop: 0,
    });
  },
  async handle_add_materials() {
    let obj = {};
    obj["id"] = this.data.optionsId;
    obj["color_data"] = this.data.color_data;
    obj["materials_supplier_id"] = this.data.materials_supplier_id;
    obj["materials_class_id"] = this.data.materials_class_id;
    obj["unit"] = this.data.unit_name;
    obj["materialsname"] = this.data.materialsname;
    obj["wsale_price"] = this.data.unit_price;
    obj["instock"] = Number(this.data.radio);
    obj["arrival_time"] = this.data.timer_price;
    obj["remarks"] = this.data.remark_price;
    obj["materialsno"] = this.data.materialsno;
    obj["breadth"] = this.data.breadth_price;
    obj["grammage"] = this.data.grammage_price;
    obj["material_data"] = this.data.LiningList;
    let res = await request({
      url: "materials_edit",
      method: "post",
      data: obj,
    });
    console.log(res);
    wx.showToast({
      title: res.data.msg,
      icon: "none",
    });
    if (res.data.error_code == 0) {
      if (this.data.options_back == 1) {
        wx.navigateBack({
          delta: 1,
        });
      } else {
        navigateTo(`/pages/materialProcess/index`);
      }
    }
    if (res.data.error_code == 2) {
      obj.confirm = 1;
      wx.showModal({
        title: "提示",
        content: res.data.msg,
        success: async (result) => {
          if (result.confirm) {
            let res = await request({
              url: "materials_edit",
              method: "post",
              data: obj,
            });
            if (res.data.error_code == 0) {
              if (this.data.options_back == 1) {
                wx.navigateBack({
                  delta: 1,
                });
              } else {
                navigateTo(`/pages/materialProcess/index`);
              }
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    }
  },
  /**
   * 第四部
   * @param {*} e
   */

  get_radio(e) {
    this.setData({
      radio: e.detail.value,
    });
  },
  get_timer_price(e) {
    this.setData({
      timer_price: e.detail.value,
    });
  },
  get_remark_price(e) {
    this.setData({
      remark_price: e.detail.value,
      cursor: e.detail.cursor,
    });
  },
  /**
   * 第三部
   * @param {*} e
   */
  async Image_recognition_content() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 1,
    });
    this.uploadTap();
    // let that = this;
  },
  get_materialsno(e) {
    this.setData({
      materialsno: e.detail.value,
    });
  },
  get_breadth_price(e) {
    this.setData({
      breadth_price: e.detail.value,
    });
  },
  get_grammage_price(e) {
    this.setData({
      grammage_price: e.detail.value,
    });
  },
  get_percent_price(e) {
    this.data.LiningList.map((v, i) => {
      if (e.currentTarget.dataset.index == i) {
        v.content = e.detail.value;
      }
    });
    this.setData({
      LiningList: this.data.LiningList,
    });
  },
  // async getMaterialList() {
  //   let res = await request({
  //     url: "get_material_select",
  //   });
  //   let { data } = res.data;
  //   this.setData({
  //     materials: data,
  //   });
  // },
  // bindMaterialsSelect: function (e) {
  //   this.data.LiningList.map((v, i) => {
  //     if (e.currentTarget.dataset.index == i) {
  //       v.material_name = this.data.materials[e.detail.value].name;
  //     }
  //   });
  //   this.setData({
  //     LiningList: this.data.LiningList,
  //   });
  // },
  close_increase(e) {
    let { index } = e.target.dataset;
    this.data.LiningList.splice(index, 1);
    this.setData({
      LiningList: this.data.LiningList,
      LiningList_length: this.data.LiningList.length - 1,
    });
  },
  add_increase() {
    this.data.LiningList.push({
      content: "",
      id: "",
      material_name: "",
    });
    this.setData({
      LiningList: this.data.LiningList,
      LiningList_length: this.data.LiningList.length - 1,
    });
  },

  /**
   * 第二部
   * @param {*} e
   */ go_supplierEntering() {
    getApp().globalData.materialProcess.classify1 = this.data.classify1;
    getApp().globalData.materialProcess.classify2 = this.data.classify2;
    getApp().globalData.materialProcess.materials_class_id = this.data.materials_class_id;
    getApp().globalData.materialProcess.unit_name = this.data.unit_name;
    getApp().globalData.materialProcess.materialsname = this.data.materialsname;
    getApp().globalData.materialProcess.unit_price = this.data.unit_price;
    getApp().globalData.materialProcess.supplier_item = this.data.supplier_item;
    getApp().globalData.materialProcess.materials_supplier_id = this.data.materials_supplier_id;
    this.QueryParams.companyname = "";
    this.setData({ companyname: this.QueryParams.companyname });
    navigateTo(`/pages/supplierEntering/index?back=1`);
  },
  get_unit_price(e) {
    this.setData({
      unit_price: e.detail.value,
    });
  },
  get_material_name(e) {
    this.setData({
      materialsname: e.detail.value,
    });
  },
  bindUnitNamesSelect: function (e) {
    this.setData({
      unit_name: this.data.unit_names[e.detail.value],
    });
  },
  async getUnitSelect() {
    let res = await request({
      url: "get_unit_select",
    });
    let unit_names = res.data.data.map((v) => {
      return v.unit_name;
    });
    this.setData({
      unit_names,
    });
  },
  async getClassnameSelect() {
    let res = await request({
      url: "get_materials_class",
    });
    let classifys = res.data.data;
    console.log(classifys);
    this.data.classifyList[0] = classifys;
    this.data.classifyList[1] = classifys[0].class_data;

    this.setData({
      classifyList: this.data.classifyList,
      classifys,
    });
  },
  bindClassifyPickerChange: function (e) {
    let classify1 = this.data.classifyList[1][this.data.classifyIndex[1]]
      .classname;
    let classify2 = this.data.classifyList[0][this.data.classifyIndex[0]]
      .classname;
    this.setData({
      classify1,
      classify2,
      materials_class_id: this.data.classifyList[1][this.data.classifyIndex[1]]
        .id,
    });
    if (this.data.classify2 == "辅料") {
      this.setData({
        materialsno: "",
        breadth_price: "",
        grammage_price: "",
        LiningList: [
          {
            content: "",
            id: "",
            material_name: "",
          },
        ],
      });
    }
  },
  bindClassifyPickerColumnChange: function (e) {
    var data = {
      classifyList: this.data.classifyList,
      classifyListSelece: this.data.classifyListSelece,
      classifyIndex: this.data.classifyIndex,
    };
    data.classifyIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      if (data.classifyIndex[0] == e.detail.value) {
        data.classifyList[1] = this.data.classifys[e.detail.value].class_data;
      }
      console.log(data.classifyList[1]);
    }
    this.setData(data);
  },
  handleSearchInput(e) {
    this.QueryParams.page = 1;
    this.QueryParams.companyname = e.detail.value;
    this.setData({
      companyname: this.QueryParams.companyname,
    });
    this.setData({
      goodsSearch: [],
    });
    this.getSupplierList();
  },
  async getSupplierList() {
    if (this.QueryParams["companyname"] == undefined) {
      let res = await request({
        url: "get_supplier_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goodsSearch: [],
        goods: [...res.data.data, ...this.data.goods],
      });
    }
    if (this.QueryParams["companyname"] != undefined) {
      let res = await request({
        url: "get_supplier_list",
        method: "post",
        data: this.QueryParams,
      });
      console.log(res);
      this.totalPages = Math.ceil(res.data.count / this.QueryParams.page_size);
      this.setData({
        goods: [],
        goodsSearch: [...res.data.data, ...this.data.goodsSearch],
      });
    }
    this.setData({
      goods_length: this.data.goods.length,
      goodsSearch_length: this.data.goodsSearch.length,
    });
  },
  async nav_goods(e) {
    let item = e.currentTarget.dataset.item;
    let arr = [];
    if (this.data.goods_length != 0) {
      this.data.goods.map((v, i) => {
        if (item.id == v.id) {
          arr[0] = v;
        }
      });
    }
    if (this.data.goodsSearch_length != 0) {
      this.data.goodsSearch.map((v, i) => {
        if (item.id == v.id) {
          arr[0] = v;
        }
      });
    }
    this.setData({
      supplier_item: arr,
      materials_supplier_id: e.currentTarget.dataset.item.id,
    });
    console.log(this.data.supplier_item);
    if (this.QueryParams["companyname"] != "") {
      this.QueryParams.page = 1;
      this.QueryParams.companyname = "";
      this.setData({
        goodsSearch: [],
        companyname: this.QueryParams.companyname,
      });
      this.getSupplierList();
    }
  },

  /**
   * 第一步
   * @param {*} e
   */
  handle_long(e) {
    console.log(e);
    if (this.data.picurl != "") {
      wx.showToast({
        title: "请先保存",
        icon: "none",
      });
      return;
    }
    if (this.data.color != "") {
      wx.showToast({
        title: "请先保存",
        icon: "none",
      });
      return;
    }
    if (this.data.color_no != "") {
      wx.showToast({
        title: "请先保存",
        icon: "none",
      });
      return;
    }
    this.setData({
      picurl: e.currentTarget.dataset.item.picurl,
      color: e.currentTarget.dataset.item.color,
      color_no: e.currentTarget.dataset.item.color_no,
      id: e.currentTarget.dataset.item.id,
    });
    this.data.color_data.map((v, i) => {
      if (this.data.id == v.id) {
        console.log(v);
        if (v.color_no != "无编号") {
          v.color_no = "";
        }
        v.color = "";
      }
    });
  },
  del_close(e) {
    wx.showModal({
      title: "提示",
      content: "确认删除",
      success: (result) => {
        this.data.color_data.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          color_data: this.data.color_data,
        });
      },
      fail: () => {},
      complete: () => {},
    });
  },
  get_color_no(e) {
    this.setData({
      color_no: e.detail.value,
    });
  },
  get_color_no_nothing() {
    this.setData({
      color_no: "无编号",
    });
  },
  affirm_color() {
    if (this.data.picurl == "") {
      wx.showToast({
        title: "请上传图片",
        icon: "none",
      });
    } else if (this.data.color == "") {
      wx.showToast({
        title: "请选择颜色",
        icon: "none",
      });
    } else if (this.data.color_no == "") {
      wx.showToast({
        title: "请填写色号",
        icon: "none",
      });
    } else {
      for (let index = 0; index < this.data.color_data.length; index++) {
        console.log(this.data.color_data);
        if (this.data.color_data[index].color == this.data.color) {
          wx.showToast({
            title: "颜色不可重复",
            icon: "none",
          });
          return;
        }
        if (
          this.data.color_data[index].color_no == this.data.color_no &&
          this.data.color_data[index].color_no != "无编号"
        ) {
          wx.showToast({
            title: "色号不可重复",
            icon: "none",
          });
          return;
        }
      }
    }
    console.log(this.data.id);
    if (
      !this.data.picurl == "" &&
      !this.data.color == "" &&
      !this.data.color_no == ""
    ) {
      console.log(this.data.id);
      if (this.data.id == "") {
        console.log(1);
        this.data.color_data.push({
          picurl: this.data.picurl,
          color: this.data.color,
          color_no: this.data.color_no,
          id: new Date().getTime(),
        });
      }
      if (this.data.id != "") {
        console.log(2);
        this.data.color_data.map((v, i) => {
          if (v.id == this.data.id) {
            v.picurl = this.data.picurl;
            v.color = this.data.color;
            v.color_no = this.data.color_no;
            v.id = new Date().getTime();
          }
        });
      }
      this.setData({
        picurl: "",
        color: "",
        color_no: "",
        id: "",
        color_data: this.data.color_data,
      });
    }
  },
  bindColorPickerChange: function (e) {
    let color = this.data.colorList[1][this.data.colorIndex[1]];
    this.setData({
      color,
    });
  },
  bindColorPickerColumnChange: function (e) {
    var data = {
      colorList: this.data.colorList,
      colorListSelece: this.data.colorListSelece,
      colorIndex: this.data.colorIndex,
    };
    data.colorIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      if (data.colorIndex[0] == e.detail.value) {
        data.colorList[1] = this.data.colors[e.detail.value].children.map(
          (v, i) => {
            return v.color_name;
          }
        );
      }
    }
    this.setData(data);
  },
  get_color_image() {
    this.setData({
      we_cropper_active: true,
      we_cropper_active_status: 0,
    });
    this.uploadTap();
  },
  closeTap() {
    this.setData({
      we_cropper_active: false,
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
                  picurl: data.data.pic_file_url,
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
                let material = await request({
                  url: "get_material_select",
                });
                console.log(res1);
                if (res1.data.error_code === 0) {
                  that.pregMaterial(
                    res1.data.data.words_result,
                    material.data.data
                  );
                  that.pregMaterialsno(res1.data.data.words_result);
                  that.preg_breadth_price(res1.data.data.words_result);
                  that.preg_grammage_price(res1.data.data.words_result);
                  that.setData({
                    words_result: res1.data.data.words_result,
                    tempFilePaths: src,
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
          // wx.uploadFile({
          //   url: "https://zhongshuyan.net/uploadpic.php",
          //   filePath: src,
          //   name: "file",
          //   formData: {
          //     user: "test",
          //   },
          //   async success(res) {
          //     let res1 = await request({
          //       url: "basicGeneral",
          //       data: {
          //         url: data1.data.pic_file_url,
          //       },
          //       method: "post",
          //     });
          //     let data = JSON.parse(res.data);
          //     let material = await request({
          //       url: "get_material_select",
          //     });
          //     if (data.error_code === 0) {
          //       that.pregMaterial(res1.data.data.words_result, material.data.data);
          //       that.pregMaterialsno(res1.data.data.words_result);
          //       that.preg_breadth_price(res1.data.data.words_result);
          //       that.preg_grammage_price(res1.data.data.words_result);
          //       that.setData({
          //         words_result: res1.data.data.words_result,
          //         tempFilePaths: src,
          //         we_cropper_active: false,
          //       });

          //       wx.showToast({
          //         title: data.msg,
          //         duration: 1500,
          //         mask: true,
          //       });
          //       wx.hideToast();
          //     }
          //   },
          // });
        }
      } else {
      }
    });
  },
  pregMaterialsno(words) {
    let aa = "";
    words.map((v, i) => {
      if (
        v.words.indexOf("品名") != -1 ||
        v.words.indexOf("编号") != -1 ||
        v.words.indexOf("货号") != -1
      ) {
        aa = v.words.substring(3);
      }
    });
    this.setData({
      materialsno: aa,
    });
    let bb = "";
    for (let i = 0; i < words.length; i++) {
      let aa = words[i].words.match(/(品名|编号|货号):?(.+)/);
      if (aa != null && aa.length > 0) {
        this.setData({
          materialsno: aa[aa.length - 1],
        });
        return;
      }
    }
  },
  preg_breadth_price(words) {
    let bb = "";
    for (let i = 0; i < words.length; i++) {
      let aa = words[i].words.match(/(幅宽)?.?([0-9]+)CM/i);
      if (aa != null && aa.length > 0) {
        bb = words[i].words.match(/[0-9]+/)[0];
        this.setData({
          breadth_price: bb,
        });
        return;
      }
    }
  },
  preg_grammage_price(words) {
    let bb = "";
    for (let i = 0; i < words.length; i++) {
      let aa = words[i].words.match(/(克重)?.?(weight)?.?([0-9]+)g/i);
      if (aa != null && aa.length > 0) {
        bb = words[i].words.match(/[0-9]+/)[0];
        this.setData({
          grammage_price: bb,
        });
        return;
      }
    }
  },
  pregMaterial(words, material) {
    let result = [];
    for (let i in words) {
      let arr = words[i]["words"].match(
        /([a-zA-Z]\/?[a-zA-Z]?[0-9]{1,2})|([0-9]{1,3}%[a-zA-Z]\\?[a-zA-Z]?)|([\u4E00-\u9FA5]+[0-9]{1,3}%?)/g
      );
      for (let j in arr) {
        for (let k in material) {
          let value = arr[j].match(/([a-zA-Z]\\?[a-zA-Z]?)|([\u4E00-\u9FA5]+)/);
          if (
            value != null &&
            (material[k]["short_name"] == value[0] ||
              material[k]["material_name"] == value[0])
          ) {
            result.push({
              material_name: material[k].name,
              content: arr[j].match(/[0-9]+/)[0],
              id: material[k].id,
            });
            break;
          }
        }
      }
    }
    if (result.length > 0) {
      this.setData({
        LiningList: result,
        LiningList_length: result.length - 1,
      });
    }
    if (result.length == 0) {
      let LiningList = [
        {
          content: "",
          id: "",
          material_name: "",
        },
      ];
      this.setData({
        LiningList,
        LiningList_length: result.length,
      });
    }
  },
  async getColorSelect() {
    let res = await request({
      url: "get_color_select",
    });
    let colors = res.data.data;
    this.data.colorList[0] = colors.map((v) => {
      return v.color_name;
    });
    this.data.colorList[1] = colors[0].children.map((v, i) => {
      return v.color_name;
    });

    this.setData({
      colorList: this.data.colorList,
      colors,
    });
  },
  onReady: function () {},

  onHide: function () {},
  onUnload: function () {},
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
