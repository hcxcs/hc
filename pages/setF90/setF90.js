// pages/setF90/setF90.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发射功率数据列表
    columns: [{
      FiledValue: "469MHz",
      KeyValue: 4,
    },{
      FiledValue: "470MHz",
      KeyValue: 8,
    },{
      FiledValue: "472MHz",
      KeyValue: 16,
    },{
      FiledValue: "474MHz",
      KeyValue: 32,
    },{
      FiledValue: "476MHz",
      KeyValue: 64,
    },{
      FiledValue: "478MHz",
      KeyValue: 128,
    }],
    index: 1,
    FiledValue: "470MHz",
    KeyValue: 8,
    isPicker: false,
    isPopup: false,
    isRead: false,
  },

  onLoad: function (options) {
    var IAddress = options.IAddress;
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
    //订阅蓝牙回复 判断是设置指令回复还是读取指令回复
    onfire.on("onBLEValueChangeOnfire",function(data){
      wx.request({
        url: app.globalData.requestUrl + '/api/terminal/Parse',
        data: { 
          hexString: data
        },
        success: function(res){
          if(_that.data.isRead){
            _that.showModal({
              msg: "读取成功"
            })
            let columns = _that.data.columns
            let resData = res.data.Data
            for(let i in columns){
              if(resData[0].Models.length == 0) break;
              if(columns[i].KeyValue == resData[0].Models[0].FiledValue){
                _that.setData({
                  isPopup: false,
                  index: i,
                  FiledValue: columns[i].FiledValue,
                  KeyValue: columns[i].KeyValue
                })
              }
            }
            _that.setData({
              isPopup: false
            })
          }else{
            _that.setData({
              isPopup: false
            })
            if(res.statusCode == "200"){
              _that.showModal({
                msg: "设置成功"
              })
            }else{
              _that.showModal({
                msg: "设置失败"
              })
            }
          }
        }
      })
    });
  },

  onUnload: function(){
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },

  showPicker(){
    this.setData({
      isPicker: true
    })
  },

  pickerConfirm(e){
    var _that = this;
    var index = e.detail.index, FiledValue = e.detail.value.FiledValue;
    _that.setData({
      isPicker: false,
      index: index,
      FiledValue: FiledValue,
      KeyValue: _that.data.columns[index].KeyValue
    })
  },

  pickerCancel(){
    this.setData({
      isPicker: false
    })
  },
  //读取指令的蓝牙发送
  orderRead(){
    var _that = this, IAddress = _that.data.IAddress.replace(/\s*/g,"");
    _that.setData({
      isPopup: true,
      isRead: true
    })
    setTimeout(function(){
      if(_that.data.isPopup){
        _that.setData({
          isPopup: false
        })
        wx.showToast({
          image: '/image/warn.png',
          title: '请求超时',
          duration: 2000
        })
      }
    },15000)
    let dataObj1 = [{
      "Fn": "010000F0",
      "Pn": "P0",
      "Models": [{"FiledValue":"55FF"},{
        "FiledValue": 20
      }]
    }]
    let dataObj2 = [{
      "Fn": "F90",
      "Pn": "P0",
      "Models": []
    }]
    let obj = {
      "Address":IAddress.length>9 ? util.getNWAddress(IAddress) : util.getAddress(IAddress),
      "Afn":IAddress.length>9 ? "21" : "10",//读 10 设 04
      "Data": IAddress.length>9 ? dataObj1 : dataObj2
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
  //设置指令的蓝牙发送
  orderSet(){
    var _that = this, IAddress = _that.data.IAddress.replace(/\s*/g,"");
    _that.setData({
      isPopup: true,
      isRead: false
    })
    setTimeout(function(){
      if(_that.data.isPopup){
        _that.setData({
          isPopup: false
        })
        wx.showToast({
          image: '/image/warn.png',
          title: '请求超时',
          duration: 2000
        })
      }
    },15000)
    let dataObj1 = [{
      "Fn": "010000F0",
      "Pn": "P0",
      "Models": [{"FiledValue":"AAFF"},{
        "FiledValue": _that.data.KeyValue
      }]
    }]
    let dataObj2 = [{
      "Fn": "F90",
      "Pn": "P0",
      "Models": [{
        "FiledValue": _that.data.FiledValue
      }]
    }]
    let obj = {
      "Address":IAddress.length>9 ? util.getNWAddress(IAddress) : util.getAddress(IAddress),
      "Afn":IAddress.length>9 ? "21" : "04",//读 10 设 04
      "Data": IAddress.length>9 ? dataObj1 : dataObj2
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