/**
 * 确认框
 * @param {object} param0 要传递的参数
 */
export const showModal = ({ content }) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: content,
      success(res) {
        resolve(res);
      },
    });
  });
};
