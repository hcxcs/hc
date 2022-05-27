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
    address: "",
    responseList: [],
    columns: [],
    FiledValue: "",
    index: 0,
    isPicker: false,
    isInput: false,
    type: 0
  },

  onLoad: function (options) {
    let _that = this;
    let IAddress = options.IAddress;
    let terminalId = options.terminalId;
    if(IAddress){
      this.setData({ IAddress, terminalId })
    }
    wx.request({
      url: app.globalData.requestUrl + "/api/monitoring/GetList",
      data: {
        interactivId: _that.data.terminalId
      },
      success: function(res){
        let columns = [];
        let singleList = res.data.singleList;
        let threeList = res.data.threeList;
        for(let i in threeList){
          columns.push({
            FiledValue: "三相表:"+threeList[i].No,
            address: threeList[i].No,
            Pn: threeList[i].PointIndex,
            PhaseType: 2
          })
        }
        for(let i in singleList){
          columns.push({
            FiledValue: "单相表:"+"00" + singleList[i][0].No.slice(2),
            address: "00" + singleList[i][0].No.slice(2),
            Pn: singleList[i][0].PointIndex,
            PhaseType: 3
          })
          for(let j in singleList[i]){
            columns.push({
              FiledValue: (singleList[i][j].PhaseType==1?'A相:':(singleList[i][j].PhaseType==2?'B相:':'C相:'))+singleList[i][j].No,
              address: singleList[i][j].No,
              Pn: singleList[i][j].PointIndex,
              PhaseType: 1
            })
          }
        }
        _that.setData({
          columns
        })
      }
    })
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
            let responseList = _that.data.responseList
            _that.setData({
              isPopup: false,
              responseList: responseList.concat(res.data.Data[0].Models)
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

  showPicker(e){
    this.setData({
      isPicker: true
    })
  },
  pickerConfirm(e){
    var _that = this;
    _that.setData({
      index: e.detail.index,
      FiledValue: e.detail.value.FiledValue,
      address: e.detail.value.address,
      isPicker: false,
      type: e.detail.value.PhaseType
    })
  },
  pickerCancel(){
    this.setData({
      isPicker: false
    })
  },
  reseverAddress(e){
    this.setData({
      isPicker: false,
      address: e.detail.value
    })
  },
  
  orderRead: function(){
    let address = this.data.address,
      isReadClose = false,
      isReadLock = false,
      i = 1;
    if(address.length!=12){
      this.showModal({
        msg: "请输入正确的地址参数"
      })
      return;
    }
    let _that = this;
    _that.setData({
      isPopup:true,
      responseList: []
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
    if(_that.data.type == 3){
      if(_that.data.isPopup){
        var timer = setInterval(function(){
          if(!isReadClose){
            if(!isReadLock){
              isReadLock = true;
              let obj = {
                "Address":util.getNWAddress(_that.data.IAddress),
                "Afn":"16",//读 10 设 04
                "Data": [{
                  "Fn": "010002E3",
                  "Pn": "P0",
                  "Models": [{
                    "FiledValue": i + address.slice(1)
                  }]
                }]
              }
              wx.request({
                url: app.globalData.requestUrl + '/api/terminal/Convert',
                data: {
                  frameJson: JSON.stringify(obj)
                },
                success: function(res){
                  let params =bluetooth.hexToBuffer(res.data.replace(/\s*/g,""));
                  bluetooth.sendMy(params);
                }
              })
              i++;
              isReadLock = false;
              if(i>3){
                isReadClose = true;
                _that.setData({
                  isPopup: false
                })
                clearInterval(timer);
              }
            }
          }
        },250)
      }
    }else{
      let dataObj = [{
        "Fn": "010002E3",
        "Pn": "P0",
        "Models": [{
          "FiledValue": address
        }]
      }]
      let obj = {
        "Address":util.getNWAddress(_that.data.IAddress),
        "Afn":"16",//读 10 设 04
        "Data": dataObj
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