import navigateTo from "../../utils/navigateRoute.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    active: false,
    show_active: false,
    my_role: "",
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      let my_role = wx.getStorageSync("role");
      this.setData({
        my_role,
      });
    },
    hide: function () {},
    resize: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    go_mine() {
      wx.reLaunch({
        url: "/pages/mine/index",
      });
    },
    go_work() {
      wx.reLaunch({
        url: "/pages/work/index",
      });
    },
    go_functionality() {
      wx.reLaunch({
        url: "/pages/functionality/index",
      });
    },
    go_homePage() {
      wx.reLaunch({
        url: "/pages/homePage/index",
      });
    },
    Ewm() {
      wx.scanCode({
        success(res) {
          console.log(res);
          if (res.scanType == "QR_CODE") {
            let path_name = res.result.slice(
              res.result.indexOf("?scene=") + "?scene=".length
            );
            let name = path_name.split("&");
            let style_id = name[1].split("=");
            let scene = name[0];
            let id = style_id[1];
            navigateTo(
              `/pages/exploitStatus/index?scene=${scene}&style_id=${id}`
            );
          }
          if (res.scanType == "WX_CODE") {
            let path_name = res.path.slice(
              res.path.indexOf("?scene=") + "?scene=".length
            );
            let name = path_name.split("&");
            let style_id = name[1].split("=");
            let scene = name[0];
            let id = style_id[1];
            navigateTo(
              `/pages/exploitStatus/index?scene=${scene}&style_id=${id}`
            );
          }
        },
      });
      this.release_tab();
    },
    go_supplier() {
      navigateTo("/pages/supplierEntering/index");
      this.release_tab();
    },
    go_Material() {
      navigateTo("/pages/materialProcessAdd/index");
      this.release_tab();
    },
    go_style() {
      navigateTo("/pages/newStyle/index");
      this.release_tab();
    },
    ani1() {
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
      });
      animation.rotate(45).step();
      this.setData({
        anirotate: animation.export(),
      });
    },
    ani4() {
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0,
      });
      animation.rotate(0).step();
      this.setData({
        anirotate: animation.export(),
      });
    },
    ani2() {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease",
        delay: 0,
      });
      animation.scale(100, 100).step();
      this.setData({
        aniscale: animation.export(),
      });
    },
    ani3() {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease",
        delay: 0,
      });
      animation.scale(1, 1).step();
      this.setData({
        aniscale: animation.export(),
      });
    },
    release_tab() {
      let show_active = this.data.show_active;
      show_active = !show_active;
      if (show_active) {
        this.ani2();
        this.ani1();
      } else {
        this.ani3();
        this.ani4();
      }
      this.setData({
        show_active,
      });
    },
    handleShow() {
      this.setData({
        active: true,
      });
    },
    handleHide() {
      this.setData({
        active: false,
      });
    },
  },
});
