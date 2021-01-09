//app.js
// import navigateTo from "./utils/navigateRoute";
App({
  onLaunch: function (options) {
    // console.log(this.globalData.token);
    // let token = wx.getStorageSync("token");
    // console.log(token);
    // // 2 判断是否存在
    // if (!token) {
    //   // 跳转到授权页面
    //   navigateTo(`/pages/login/index`);
    // } else {
    //   // 有token 直接写逻辑
    //   console.log("有 token");
    // }
  },
  onShow: function (options) {},
  onHide: function () {},
  onError: function (msg) {},
  //options(path,query,isEntryPage)
  onPageNotFound: function (options) {},
  globalData: {
    userInfo: null,
    token: "",
    designation: "",
    designidea: "",
    cursor: "",
    styleno: "",
    project: "",
    project_id: "",
    style_type: "",
    year: "",
    season: "",
    stylist: "",
    stylist_id: "",
    user_id_data: [],
    images_upload_list: [],
    project: {
      designidea: "",
      cursor: "",
      picurl: "",
      project_name: "",
      projecttype: "",
      projecttypenum: "",
      companynames: "",
      companynames_id: "",
      claim_num: "",
      year: "",
      season: "",
      element: "",
      date: "",
      color_no: "",
      stylist: "",
      stylist_id: "",
      user_id_data: [],
    },
    materialProcess: {
      color_data: [],
      classify1: "",
      classify2: "",
      materials_class_id: "",
      unit_name: "",
      materialsname: "",
      unit_price: "",
      supplier_item: [],
      materialsno: "",
      breadth_price: "",
      grammage_price: "",
      LiningList: [],
      remark_price: "",
      cursor: "",
      radio: "",
      timer_price: "",
      materials_supplier_id: "",
    },
    re_form: {
      money: "",
      reason: "",
      cursor: "",
      account_name: "",
      account_id: "",
      balance: "",
      auth_name: "",
      auth_id: "",
      picurl: "",
      business_time: "",
      account_type_id: "",
      account_type_name: "",
      type: "",
    },
    pay_form: {
      money: "",
      reason: "",
      cursor: "",
      account_name: "",
      account_id: "",
      balance: "",
      auth_name: "",
      auth_id: "",
      type: "",
    },
  },
});
