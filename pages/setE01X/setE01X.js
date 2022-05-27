// pages/setF9/setF9.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
var debounceNumber;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPopup: false,
    isRead: false, 
    isFull: false, //是否全选
    pointIndex:1,
    checkList:[{
      checkName: "测量点接线方式",
      isCheck: false,
      ipt:"picker",
      type:"10",
      columns:[{
        FiledValue:"01-单相",
        keyValue:1
      },{
        FiledValue:"03-三相三线",
        keyValue:3
      },{
        FiledValue:"04-三相四线",
        keyValue:4
      }],
      FiledValue:"04-三相四线",
      keyValue:4,
      index: 2
    },{
      checkName: "额定电压(二次侧)",
      isCheck: false,
      type:"11",
      ipt:"number",
      FiledValue:"220"
    },{
      checkName: "额定电流",
      isCheck: false,
      type:"12",
      ipt:"number",
      FiledValue:"60"
    },{
      checkName: "用户申报容量",
      isCheck: false,
      type:"13",
      ipt:"number",
      FiledValue:"39.6"
    },{
      checkName: "变压器容量",
      isCheck: false,
      type:"14",
      ipt:"number",
      FiledValue:"39.6"
    }],
    isPicker: ""
  },

  onLoad: function (options) {
    debounceNumber = this.debounce(this.setDatas, 500)
    let IAddress = options.IAddress;
    let checkList = this.data.checkList;
    if(IAddress.slice(1)==4){
      checkList[2].FiledValue = 6;
      checkList[3].FiledValue = 3.96;
      checkList[4].FiledValue = 3.96;
    }
    if(IAddress){
      this.setData({ IAddress, checkList })
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
                if(resData[j].Fn.substring(0,2) === "1F"){
                  for(let i in checkList){
                    if(checkList[i].ipt === "picker"){
                      checkList[i].keyValue = resData[j].Models[i].FiledValue
                      for(let k in checkList[i].columns){
                        if(checkList[i].columns[k].keyValue == resData[j].Models[i].FiledValue){
                          checkList[i].FiledValue = checkList[i].columns[k].FiledValue;
                          checkList[i].index = k;
                        }
                      }
                    }else{
                      checkList[i].FiledValue = resData[j].Models[i].FiledValue
                    }
                  }
                  break;
                }else{
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
                      }else{
                        checkList[i].FiledValue = resData[j].Models[0].FiledValue
                      }
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
  reseverNumber(e){
    this.setData({
      isPicker: ""
    })
    debounceNumber(e.detail.value, e.currentTarget.dataset.index);
  },

  orderRead: function(){
    let pointIndex = this.data.pointIndex
    if(pointIndex<0||pointIndex>12){
      this.showModal({
        msg:"Pn范围在1~12"
      })
      return;
    }
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
    let dataObj = [{
      "Fn": "1F0080E0",
      "Pn": "P" + _that.data.pointIndex,
      "Models": []
    }]
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        data.push({
          "Fn": checkList[i].type + "0080E0",
          "Pn": "P" + _that.data.pointIndex,
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
      "Data": data.length ===5 ? dataObj : data
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
    let pointIndex = this.data.pointIndex
    if(pointIndex<0||pointIndex>12){
      this.showModal({
        msg:"Pn范围在1~12"
      })
      return;
    }
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
    let checkList = _that.data.checkList;
    let dataOdj = [{
      "Fn": "1F0080E0",
      "Pn": "P1",
      "Models": checkList.map((ele,index)=>{
        return {
          "FiledValue": ele.ipt === 'picker' ? ele.keyValue : ele.FiledValue
        }
      })
    }]
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        data.push({
          "Fn": checkList[i].type + "0080E0",
          "Pn": "P1",
          "Models": [{
            "FiledValue": checkList[i].ipt === 'picker' ? checkList[i].keyValue : checkList[i].FiledValue
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
      "Address":"057101000004",
      "Afn":"04",//读 10 设 04
      "Data": data.length === 5 ? dataOdj : data
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
  reseverPointIndex(e){
    this.setData({
      pointIndex: e.detail.value
    })
  },
  setDatas(content, index){
    let checkList = this.data.checkList
    checkList[index].FiledValue = content;
    if(index==1||index==2){
      checkList[3].FiledValue = (checkList[1].FiledValue*checkList[2].FiledValue*3)/1000;
      checkList[4].FiledValue = (checkList[1].FiledValue*checkList[2].FiledValue*3)/1000;
    }
    this.setData({ checkList })
  },
  debounce(fun, delay) {
    return function (args1, args2) {
      let that = this
      let _args1 = args1
      let _args2 = args2
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args1, _args2);
      }, delay)
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