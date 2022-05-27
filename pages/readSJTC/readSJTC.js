// pages/setF9/setF9.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopup: false,
    sendMsg: "",
    responseMsg: ""
  },

  onLoad: function (options) {
    let IAddress = options.IAddress;
    if(IAddress){
      this.setData({ IAddress })
    }
  },

  onShow: function () {
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
    var _that = this;
    onfire.on("onBLECloseSuccess", function(data){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    });
    onfire.on("onBLEValueChangeOnfire",function(data){
      wx.request({
        url: app.globalData.requestUrl + '/api/terminal/Parse',
        data: { 
          hexString: data
        },
        success: function(res){
          if(res.statusCode == "200"){
            _that.showModal({
              msg: "读取成功"
            })
            _that.setData({
              isPopup: false
            })
          }
        }
      })
    })
  
  },

  onUnload: function(){
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },

  reseverMsg(e){
    this.setData({
      sendMsg: e.detail.value
    })
  },
  
  orderRead: function(){
    let sendMsg = this.data.sendMsg.replace(/\s*/g,"");
    var pattern = /^[A-Fa-f0-9]+$/;
    if(pattern.test(sendMsg)&&sendMsg.length%2==0){
      let _that = this;
      _that.setData({
        isPopup:true
      })
      setTimeout(function(){
        if(_that.data.isPopup){
          _that.setData({
            isPopup: false
          })
          wx.showToast({
            title: '请求超时',
            image: '/image/warn.png',
            duration: 2000
          })
        }
      },15000)
        var params =bluetooth.hexToBuffer(sendMsg.replace(/\s*/g,""));
        bluetooth.sendMy(params);
    }else{
      this.showModal({
        msg: "请输入正确的数据帧"
      })
      return;
    }
  },
  
  showModal(error){
    wx.showModal({
      title: '提示',
      content: error.msg,
      showCancel:false
    })
  },
})