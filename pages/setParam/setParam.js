/**
 * 读设指令中转页面
 */
const app = getApp()
Page({
  onLoad: function (options) {
    const IAddress = options.IAddress;
    const terminalId = options.terminalId;
    if(IAddress)
    this.setData({ IAddress, terminalId });
  },

  jumpUrl(e){
    const url = e.currentTarget.dataset.href;
    wx.navigateTo({
      url: url + "?IAddress=" + this.data.IAddress + "&terminalId=" + this.data.terminalId,
    })
  },

})
