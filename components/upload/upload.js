import WeCropper from "../we-cropper/we-cropper.js";

const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio;
const height = device.windowHeight - 70;
const fs = (width / 750) * 2;

Component({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: "", //确定裁剪后的图片
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
  },
  methods: {
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
          console.log(self.cropper.pushOrign);
          self.cropper.pushOrign(src);
        },
      });
    },

    getCropperImage() {
      console.log(1);
      let that = this;
      wx.showToast({
        title: "上传中",
        icon: "loading",
        duration: 20000,
      });
      // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
      this.cropper.getCropperImage((src) => {
        console.log(2);
        if (src) {
          wx.uploadFile({
            url: "https://yj.ppp-pay.top/uploadpic.php", //仅为示例，非真实的接口地址
            filePath: src,
            name: "file",
            formData: {
              user: "test",
            },
            success(res) {
              let data = JSON.parse(res.data);
              if (data.error_code === 0) {
                console.log(data);
                that.setData({
                  imgSrc: data.data.pic_file_url,
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
        } else {
          console.log("获取图片地址失败，请稍后重试");
        }
      });
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  ready: function (options) {
    console.log(1);
    const { cropperOpt } = this.data;

    this.cropper = new WeCropper(cropperOpt)
      .on("ready", (ctx) => {
        console.log(`wecropper is ready for work!`);
      })
      .on("beforeImageLoad", (ctx) => {
        wx.showToast({
          title: "上传中...",
          icon: "loading",
          duration: 20000,
        });
      })
      .on("imageLoad", (ctx) => {
        wx.hideToast();
      });

    //刷新画面
    this.cropper.updateCanvas();
  },
});
