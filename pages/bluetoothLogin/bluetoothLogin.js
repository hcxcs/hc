
//获取应用实例
const bluetooth=require('../../utils/bluetooth');
const onfire=require('../../utils/onfire1.0.6.js');
var app = getApp();
Page({
  data: {
    devices: [],
    chartHeight:600,
    isPopup: false,
  },
  onLoad: function (options) {
    let _that = this;
    let obj = JSON.parse(options.terminal);
    bluetooth.closeBleConnettion();
    //通过options获取能效交互终端地址
    let terminalId = obj.Id, IAddress = obj.IAddress;
    _that.setData({ terminalId, IAddress, terminal: options.terminal })
    // const jumpUrl = options.jumpUrl;
    // if(jumpUrl == "scan"){
    //   _that.setData({
    //     IAddress: options.IAddress,
    //     terminalId: options.terminalId,
    //     threeList: options.threeList,
    //     singleList: options.singleList,
    //     jumpUrl: jumpUrl
    //   })
    // }else if(jumpUrl == "setParam"){
    //   _that.setData({
    //     terminalId: options.terminalId,
    //     IAddress: options.IAddress,
    //     jumpUrl: jumpUrl
    //   })
    // }else if(jumpUrl == "terminalDetails"){
    //   _that.setData({ jumpUrl });
    // }
    wx.getSystemInfo({
      success: function (res) {
        _that.setData({
          chartHeight: res.windowHeight-100,
        });
      }
    });
    
    onfire.on("onBLEDeviceUpdateOnfire",function(data){
      _that.setData({devices: data, isPopup: false})
      });
    onfire.on("onBLEConnSuccess",function(data){
      let url = '../terminalDetails/terminalDetails?terminal=' + _that.data.terminal;
      wx.redirectTo({
        url: url
      })
      // var jumpUrl = _that.data.jumpUrl;
      // if(jumpUrl == "scan"){
      //   wx.redirectTo({
      //     url: '/pages/scan/scan?IAddress=' + _that.data.IAddress + '&terminalId=' + _that.data.terminalId + '&threeList=' + _that.data.threeList + '&singleList=' + _that.data.singleList,
      //   })
      // }
      // if(jumpUrl == "setParam"){
      //   let url;
      //   if(_that.data.IAddress.length==9) url = '/pages/setParam/setParam?IAddress=' + _that.data.IAddress + "&terminalId=" + _that.data.terminalId;
      //   else url = '/pages/setNWParam/setNWParam?IAddress=' + _that.data.IAddress + "&terminalId=" + _that.data.terminalId;
      //   wx.redirectTo({
      //     url: url
      //   })
      //   let pages = getCurrentPages();
      //   pages[pages.length-2].setData({
      //     isBlueTooth: true
      //   })
      // }
      // if(jumpUrl == "terminalDetails"){
      //   var pages = getCurrentPages(); // 当前页面
      //   var beforePage = pages[pages.length - 2]; // 前一个页面
      //   wx.navigateBack({
      //       success: function() {
      //         onfire.un("onBLEConnSuccess");
      //         onfire.un("onBLEDeviceUpdateOnfire");
      //         beforePage.setData({
      //           isDisable: false,
      //           isRead: true,
      //           isBlueTooth: true,
      //           orderIndex: 1
      //         })
      //       }
      //   });
      // }
    });

  },
  onUnload: function(){
    onfire.un("onBLEConnSuccess");
    onfire.un("onBLEDeviceUpdateOnfire");
  },
  onShow:function() {
    // this.setData({
    //   isPopup: true
    // })
    this.lanya3();
  },
  //搜索设备
  lanya3: function () {

    bluetooth.bluetoothLoad('');
  },
  //连接设备
  connectTO: function (e) {
    this.setData({
      isPopup: true
    })
    bluetooth.connetBlue(e.currentTarget.id);
    
  }
})
