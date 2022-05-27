// pages/setF9/setF9.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
var debounceNumber, debouncePoint, debounceIp;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRead: false, 
    isFull: false, //是否全选
    checkList:[{
      checkName: "主站通讯地址",
      isCheck: false,
      ipt:"multiple",
      type:"00",
      ips:[{
        FiledValue: "123"
      },{
        FiledValue: "225"
      },{
        FiledValue: "12"
      },{
        FiledValue: "3"
      }],
      point: "9001",
      columns:[{
        FiledValue:"02-GPRS/CDMA",
        keyValue:2
      },{
        FiledValue:"03-PSTN",
        keyValue:3
      },{
        FiledValue:"04-Ethernet",
        keyValue:4
      },{
        FiledValue:"06-RS232/RS485",
        keyValue:6
      },{
        FiledValue:"07-CSD",
        keyValue:7
      },{
        FiledValue:"08-Radio",
        keyValue:8
      }],
      FiledValue:"02-GPRS/CDMA",
      keyValue:2,
      index: 0
    },{
      checkName: "备用通讯地址1",
      isCheck: false,
      ipt:"multiple",
      type:"01",
      ips:[{
        FiledValue: "123"
      },{
        FiledValue: "225"
      },{
        FiledValue: "12"
      },{
        FiledValue: "3"
      }],
      point: "9001",
      columns:[{
        FiledValue:"02-GPRS/CDMA",
        keyValue:2
      },{
        FiledValue:"03-PSTN",
        keyValue:3
      },{
        FiledValue:"04-Ethernet",
        keyValue:4
      },{
        FiledValue:"06-RS232/RS485",
        keyValue:6
      },{
        FiledValue:"07-CSD",
        keyValue:7
      },{
        FiledValue:"08-Radio",
        keyValue:8
      }],
      FiledValue:"04-Ethernet",
      keyValue:4,
      index: 2
    },{
      checkName: "备用通讯地址2",
      isCheck: false,
      type:"02",
      ipt:"multiple",
      ips:[{
        FiledValue: "123"
      },{
        FiledValue: "225"
      },{
        FiledValue: "12"
      },{
        FiledValue: "3"
      }],
      point: "9001",
      columns:[{
        FiledValue:"02-GPRS/CDMA",
        keyValue:2
      },{
        FiledValue:"03-PSTN",
        keyValue:3
      },{
        FiledValue:"04-Ethernet",
        keyValue:4
      },{
        FiledValue:"06-RS232/RS485",
        keyValue:6
      },{
        FiledValue:"07-CSD",
        keyValue:7
      },{
        FiledValue:"08-Radio",
        keyValue:8
      }],
      FiledValue:"02-GPRS/CDMA",
      keyValue:2,
      index: 0
    },{
      checkName: "APN(GPRS用)",
      isCheck: false,
      ipt:"number",
      type:"04",
      FiledValue:"CMNET"
    },{
      checkName: "心跳间隔",
      isCheck: false,
      ipt:"number",
      type:"07",
      FiledValue:"15"
    },{
      checkName: "TCP/UDP标识",
      isCheck: false,
      type:"0A",
      ipt:"picker",
      columns:[{
        FiledValue:"TCP方式",
        keyValue:0
      },{
        FiledValue:"UDP方式",
        keyValue:1
      }],
      FiledValue:"TCP方式",
      keyValue:0,
      index: 0
    }
  ],
    isPicker: ""
  },

  onLoad: function (options) {
    debounceNumber = this.debounce(this.setDatas, 500)
    debouncePoint = this.debounce(this.setDatas, 500)
    debounceIp = this.debounce(this.setDatas, 500)
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
      console.log("蓝牙回复" + data)
      //读取指令 蓝牙回复
      if(_that.data.isRead){
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
              let checkList = _that.data.checkList
              let resData = res.data.Data
              for(let j in resData){
                for(let i in checkList){
                  if(checkList[i].type === resData[j].Fn.substring(0,2)){
                    if(checkList[i].ipt === "picker"){
                      checkList[i].keyValue = resData[j].Models[0].FiledValue
                      for(let k in checkList[i].columns){
                        if(checkList[i].columns[k].keyValue == resData[j].Models[0].FiledValue){
                          checkList[i].FiledValue = checkList[i].columns[k].FiledValue;
                          checkList[i].index = k;
                        }
                      }
                    }else if(checkList[i].ipt === "multiple"){
                      let ip = resData[j].Models[0].FiledValue.split(':')[0];
                      let ips = ip.split('.');
                      let point = resData[j].Models[0].FiledValue.split(':')[1];
                      let type = resData[j].Models[1].FiledValue;
                      checkList[i].point = point;
                      for(let m in checkList[i].ips){
                        checkList[i].ips[m].FiledValue = ips[m]
                      }
                      for(let m in checkList[i].columns){
                        if(checkList[i].columns[m].keyValue == type){
                          checkList[i].index = m
                          checkList[i].keyValue = checkList[i].columns[m].keyValue
                          checkList[i].FiledValue = checkList[i].columns[m].FiledValue
                        }
                      }
                    }else{
                      checkList[i].FiledValue = resData[j].Models[0].FiledValue
                    }
                  }
                }
              }
              _that.setData({
                isPopup: false,
                checkList: checkList
              })
            }
          }
        })
      }else{
        //设置指令 蓝牙回复
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            if(res.statusCode == "200"){
              _that.showModal({
                msg: "设置成功"
              })
              _that.setData({
                isPopup: false
              })
            }
          }
        })
      }
    })
  },

  onUnload: function(){
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },

  //点击“全选”
  fullChange: function(){
    var _that = this;
    var checkList = _that.data.checkList;
    var isFull = !_that.data.isFull;
    for(var i in checkList){
      checkList[i].isCheck = isFull;
    }
    _that.setData({ isFull, checkList, isPicker: "" }) 
  },
 //选择单项
  onChange: function(e) {
    var _that = this;
    var i = e.currentTarget.dataset.index;
    var checkList = _that.data.checkList;
    var isFull = false;
    checkList[i].isCheck = !checkList[i].isCheck;
    _that.setData({ checkList, isFull, isPicker: "" })
  },

  orderRead: function(){
    let _that = this;
    _that.setData({
      isRead: true,
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
    let checkList = this.data.checkList
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        data.push({
          "Fn": checkList[i].type + "0100E0",
          "Pn": "P0",
          "Models": []
        })
      }
    }
    if(data.length == 0){
      _that.setData({
        isPopup:false
      })
      wx.showToast({
        title: '选择指令',
        image: '/image/warn.png',
        duration: 2000
      })
      return;
    }
    let obj = {
      "Address": util.getNWAddress(_that.data.IAddress),
      "Afn":"10",//读 10 设 04
      "Data": data
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

  orderSet: function(){
    let _that = this;
    _that.setData({
      isRead: false,
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
    let checkList = this.data.checkList
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        let FiledValue
        if(checkList[i].ipt === "picker") FiledValue = checkList[i].keyValue;
        else if(checkList[i].ipt === "number") FiledValue = checkList[i].FiledValue;
        else{
          let ip = checkList[i].ips.map((obj) => {
            return obj.FiledValue
          }).join(".")
          FiledValue = ip + ":" + checkList[i].point;
        }
        data.push({
          "Fn": checkList[i].type + "0100E0",
          "Pn": "P0",
          "Models": checkList[i].ipt === 'multiple'?[{
            "FiledValue": FiledValue
          },{
            "FiledValue": checkList[i].keyValue
          }]:[{
            "FiledValue": FiledValue
          }]
        })
      }
    }
    if(data.length == 0){
      _that.setData({
        isPopup:false
      })
      wx.showToast({
        title: '选择指令',
        image: '/image/warn.png',
        duration: 2000
      })
      return;
    }
    let obj = {
      "Address":util.getNWAddress(_that.data.IAddress),
      "Afn":"04",//读 10 设 04
      "Data": data
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
  reseverNumber(e){
    this.setData({
      isPicker: ""
    })
    debounceNumber("number", e.detail.value, e.currentTarget.dataset.index);
  },
  reseverPoint(e){
    this.setData({
      isPicker: ""
    })
    debouncePoint("point", e.detail.value, e.currentTarget.dataset.index);
  },
  reseverIp(e){
    this.setData({
      isPicker: ""
    })
    debounceIp("ip", e.detail.value, e.currentTarget.dataset.index, e.currentTarget.dataset.index2);
  },
  setDatas(flag, content, index, index2){
    let checkList = this.data.checkList
    if(flag === "number")
      checkList[index].FiledValue = content;
    else if(flag === "point")
      checkList[index].point = content;
    else
      checkList[index].ips[index2].FiledValue = content;
    this.setData({ checkList })
  },
  debounce(fun, delay) {
    return function (args1, args2, args3, args4) {
      let that = this
      let _args1 = args1
      let _args2 = args2
      let _args3 = args3
      let _args4 = args4
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args1, _args2, _args3, _args4);
      }, delay)
    }
  },
  showPicker(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      isPicker: this.data.checkList[index].type
    })
  },
  pickerConfirm(e){
    var _that = this;
    var index = e.detail.index, 
        keyValue = e.detail.value.keyValue,
        FiledValue = e.detail.value.FiledValue,
        checkList = this.data.checkList,
        listIndex = e.currentTarget.dataset.index;
    checkList[listIndex].index = index, 
    checkList[listIndex].FiledValue = FiledValue
    checkList[listIndex].keyValue = keyValue;
    _that.setData({
      isPicker: "",
      checkList: checkList
    })
  },
  pickerCancel(){
    this.setData({
      isPicker: ""
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