function navigateTo(url) {
  if (getCurrentPages().length >= 10) {
    wx.redirectTo({
      url: url,
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    });
  } else {
    wx.navigateTo({
      url: url,
    });
  }
}
module.exports = navigateTo;
