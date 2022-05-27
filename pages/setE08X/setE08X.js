// pages/setF9/setF9.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
var debounceNumber, debounceMultipleNumber;
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
      checkName: "电流不平衡度阈值",
      isCheck: false,
      type:"00",
      FiledValue:"30",
    },{
      checkName: "电流不平衡度回复阈值",
      isCheck: false,
      type:"01",
      FiledValue:"25",
    },{
      checkName: "合格电压上限",
      isCheck: false,
      type:"02",
      FiledValue:"1.07",
    },{
      checkName: "合格电压下限",
      isCheck: false,
      type:"03",
      FiledValue:"0.93",
    },{
      checkName: "判断电流过流的相对额定值的比例",
      isCheck: false,
      type:"04",
      FiledValue:"1.3",
    },{
      checkName: "判断负荷过载相对额定值的比例",
      isCheck: false,
      type:"05",
      FiledValue:"1.2",
    },{
      checkName: "判断负荷过载恢复的相对额定值的比例",
      isCheck: false,
      type:"06",
      FiledValue:"0.95",
    },{
      checkName: "零相电流报警阈值",
      isCheck: false,
      type:"07",
      FiledValue:"25",
    },{
      checkName: "零相电流报警恢复阈值",
      isCheck: false,
      type:"08",
      FiledValue:"15",
    },{
      checkName: "判断电流过负荷恢复的相对额定值的比例",
      isCheck: false,
      type:"09",
      FiledValue:"1",
    },{
      checkName: "电压不平衡度阈值",
      isCheck: false,
      type:"0A",
      FiledValue:"50",
    },{
      checkName: "电压不平衡度恢复阈值",
      isCheck: false,
      type:"0B",
      FiledValue:"30",
    },{
      checkName: "失相、失流、断相的判断阈值",
      isCheck: false,
      type:"0C",
      ipt:"multiple",
      columns:[{
        type:"0B",
        FiledValue:"78",
        keyValue:"启动电压"
      },{
        type:"0B",
        FiledValue:"85",
        keyValue:"返回电压"
      },{
        type:"0B",
        FiledValue:"0.5",
        keyValue:"启动电流"
      },{
        type:"0B",
        FiledValue:"5",
        keyValue:"返回电流"
      }],
      FiledValue: "78,85,0.5,5"
    }]
  },

  onLoad: function (options) {
    debounceNumber = this.debounce(this.setDatas, 500)
    debounceMultipleNumber = this.debounce(this.setDatas, 500)
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
              console.log(res.data);
              let checkList = _that.data.checkList
              let resData = res.data.Data
              for(let j in resData){
                if(resData[j].Fn.substring(0,2) === "0F"){
                  for(let i in checkList){
                    if(checkList[i].ipt === "multiple"){
                      let multipleArr = resData[0].Models[i].FiledValue.split(',')
                      for(let l in multipleArr){
                        if(isNaN(multipleArr[l])) continue;
                        checkList[i].columns[l].FiledValue = multipleArr[l]
                      }
                    }
                    if(isNaN(resData[0].Models[i].FiledValue)) continue;
                    checkList[i].FiledValue = resData[0].Models[i].FiledValue
                  }
                  break;
                }else{
                  for(let i in checkList){
                    if(checkList[i].type === resData[j].Fn.substring(0,2)){
                      if(checkList[i].ipt === "multiple"){
                        let multipleArr = resData[j].Models[0].FiledValue.split(',')
                        for(let l in multipleArr){
                          if(isNaN(multipleArr[l])) continue;
                          checkList[i].columns[l].FiledValue = multipleArr[l]
                        }
                      }
                      if(isNaN(resData[j].Models[0].FiledValue)) continue;
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
    _that.setData({ isFull, checkList }) 
  },
 //选择单项
  onChange: function(e) {
    var _that = this;
    var i = e.currentTarget.dataset.index;
    var checkList = _that.data.checkList;
    var isFull = false;
    checkList[i].isCheck = !checkList[i].isCheck;
    _that.setData({ checkList, isFull })
  },
  reseverNumber(e){
    debounceNumber(e.detail.value, e.currentTarget.dataset.index);
  },
  reseverMultiple(e){
    debounceMultipleNumber(e.detail.value, e.currentTarget.dataset.index, e.currentTarget.dataset.index2);
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
      "Fn": "0F0180E0",
      "Pn": "P" + _that.data.pointIndex,
      "Models": []
    }]
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        data.push({
          "Fn": checkList[i].type + "0180E0",
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
      "Data": data.length ===13 ? dataObj : data
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
    let checkList = this.data.checkList
    let dataObj = [{
      "Fn": "0F0180E0",
      "Pn": "P" + _that.data.pointIndex,
      "Models": checkList.map((ele,index)=>{
        return {
          "FiledValue": ele.FiledValue
        }
      })
    }]
    let data = [];
    for(let i in checkList){
      if(checkList[i].isCheck){
        data.push({
          "Fn": checkList[i].type + "0180E0",
          "Pn": "P" + _that.data.pointIndex,
          "Models": [{
            "FiledValue": checkList[i].FiledValue
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
      "Data": data.length === 13 ? dataObj : data
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
  debounce(fun, delay) {
    return function (args1, args2, args3) {
      let that = this
      let _args1 = args1
      let _args2 = args2
      let _arg3 = args3
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args1, _args2, _arg3);
      }, delay)
    }
  },
  setDatas(content, index, index2){
    let checkList = this.data.checkList
    if(index2!=undefined){
      checkList[index].columns[index2].FiledValue = content;
      checkList[index].FiledValue = checkList[index].columns.map((obj) => {
        return obj.FiledValue
    }).join(",")
    }else
      checkList[index].FiledValue = content;
    this.setData({ checkList })
  },
  reseverPointIndex(e){
    this.setData({
      pointIndex: e.detail.value
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