import navigateTo from "../utils/navigateRoute";
import { url } from "./url";
// 1 同时发送出去的异步请求的个数
let ajaxTimes = 0;

export const request = (params) => {
  let token = wx.getStorageSync("token");
  // // 2 判断是否存在
  // if (!token && params.url != "login") {
  //   // 跳转到授权页面
  //   navigateTo(`/pages/login/index`);
  //   return;
  // }
  /* 
  1 因为首页是同时发送3个请求出去
  2 当某一个请求回来了就会关闭等待图标
  3 但是 后两个请求还没有回来，页面上已经没有等待图标。。。
  
  1 必须等待3个请求都回来了，再关闭 等待图标！！！
   */
  // 显示正在等待的图标
  wx.showLoading({
    title: "加载中。。。",
  });
  ajaxTimes++;

  // 统一的接口的前缀
  // const baseUrl = "https://yj.ppp-pay.top/webapi.php?g=";
  const baseUrl = `${url}/webapi.php?g=`;
  // const baseUrl = "https://shesho.ppp-pay.top/wechatapi.php?g=";
  return new Promise((reslove, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header: {
        Authorization: "Bearer " + token,
      },
      success: (result) => {
        if (
          result.data.error_code == -1000 ||
          result.data.error_code == -1001
        ) {
          let get_time_co = wx.getStorageSync("time_co");
          if (new Date().getTime() - get_time_co > 5000) {
            wx.removeStorageSync("token");
            wx.showLoading({
              title: "登录已失效,请重新登录!",
            });
            navigateTo(`/pages/login/index`);
            wx.setStorageSync("time_co", new Date().getTime());
          }
        }
        reslove(result);
      },
      fail: (error) => {
        reject(error);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          // 同时发送出去的请求 都回来了
          wx.hideLoading();
        }
      },
    });
  });
};
