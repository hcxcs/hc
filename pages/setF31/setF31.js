// pages/setF31/setF31.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    nowTime: "", //当前时间
    isPopup: false,
  },

  onLoad: function (options) {
    var _that = this;
    var IAddress = options.IAddress;
    if(IAddress){
      _that.setData({ IAddress })
    }
    setInterval(function(){
		  var time = new Date();
		  var year = time.getFullYear();  //获取年份
		  var month = checkTime(time.getMonth()+1);  //获取月份
		  var day = checkTime(time.getDate());   //获取日期
		  var hour = checkTime(time.getHours());   //获取时
		  var minite = checkTime(time.getMinutes());  //获取分
		  var second = checkTime(time.getSeconds());  //获取秒
		  /****当时、分、秒、小于10时，则添加0****/
		  function checkTime(i){
			  if(i < 10) return "0" + i;
			  return i;
		  }	  
      _that.setData({
        nowTime: year+"-"+month+"-"+day+" "+hour+":"+minite+":"+second
      })
		},1000);
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
          _that.setData({
            isPopup: false
          })
          if(res.statusCode == "200"){
            _that.showModal({
              msg: "设置成功"
            })
          }
        }
      })
    })
  },

  btnSet: function(){
    var _that = this, IAddress = _that.data.IAddress.replace(/\s*/g,"");
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
    let obj = {
      "Address":IAddress.length>9 ? util.getNWAddress(IAddress) : util.getAddress(IAddress),
      "Afn":"05",//读 10 设 04
      "Data": [{
        "Fn": IAddress.length>9 ? "300100E0" : "F31",
        "Pn": "P0",
        "Models": [{
          "FiledValue": _that.data.nowTime
        }]
      }]
    }
    wx.request({
      url: app.globalData.requestUrl + '/api/terminal/Convert',
      data: {
        frameJson: JSON.stringify(obj)
      },
      success: function(res){
        var params =bluetooth.hexToBuffer(res.data.replace(/\s*/g,""));
        bluetooth.sendMy(params);
      }
    })
  },
  showModal(error){
    wx.showModal({
      title: '提示',
      content: error.msg,
      showCancel:false
    })
  },

})