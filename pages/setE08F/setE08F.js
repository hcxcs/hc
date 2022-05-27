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
      display: true,
      checkName: "测量点的状态",
      isCheck: false,
      ipt:"picker",
      type:"00",
      columns:[{
        FiledValue:"0:无效",
        keyValue:0
      },{
        FiledValue:"1:有效",
        keyValue:1
      }],
      FiledValue:"1:有效",
      keyValue:1,
      index: 1
    },{
      display: false,
      checkName: "测量点性质",
      isCheck: false,
      ipt:"picker",
      type:"01",
      columns:[{
        FiledValue:"01:485表",
        keyValue:1
      },{
        FiledValue:"02:模拟量",
        keyValue:2
      },{
        FiledValue:"03:脉冲量",
        keyValue:3
      },{
        FiledValue:"04:计算值",
        keyValue:4
      },{
        FiledValue:"05:交流采样",
        keyValue:5
      }],
      keyValue:1,
      FiledValue:"01:485表",
      index: 0
    },{
      display: true,
      checkName: "测量点地址",
      isCheck: false,
      type:"02",
      ipt:"number",
      FiledValue:"123456789011"
    },{
      display: false,
      checkName: "测量点通信规约",
      isCheck: false,
      ipt:"picker",
      type:"03",
      columns:[{
        FiledValue:"00H:DL/T645-1997规约",
        keyValue:0
      },{
        FiledValue:"01H:DL/T645-2007规约",
        keyValue:1
      },{
        FiledValue:"02H:广东97电表规约",
        keyValue:2
      },{
        FiledValue:"03H:广东07电表规约",
        keyValue:3
      },{
        FiledValue:"04H:威胜自定义规约",
        keyValue:4
      },{
        FiledValue:"05H:兰吉尔B表规约",
        keyValue:5
      },{
        FiledValue:"06H:兰吉尔D表规约",
        keyValue:6
      },{
        FiledValue:"07H:EDMI表规约",
        keyValue:7
      },{
        FiledValue:"08H:ABB方表规约",
        keyValue:8
      },{
        FiledValue:"09H:埃托利表规约",
        keyValue:9
      },{
        FiledValue:"0AH:EMAIL表规约",
        keyValue:10
      },{
        FiledValue:"0BH:其他规约",
        keyValue:11
      }],
      keyValue:1,
      FiledValue:"01H:DL/T645-2007规约",
      index: 1
    },{
      display: true,
      checkName: "电能表类型",
      isCheck: false,
      ipt:"picker",
      type:"04",
      columns:[{
        FiledValue:"01-单相电子表",
        keyValue:1
      },{
        FiledValue:"02-多功能表",
        keyValue:2
      },{
        FiledValue:"03-其他类型",
        keyValue:3
      }],
      keyValue:1,
      FiledValue:"01-单相电子表",
      index: 0
    },{
      display: false,
      checkName: "总分类型",
      isCheck: false,
      ipt:"picker",
      type:"05",
      columns:[{
        FiledValue:"0-用户表",
        keyValue:0
      },{
        FiledValue:"1-总表",
        keyValue:1
      }],
      keyValue:1,
      FiledValue:"1-总表",
      index: 1
    },{
      display: false,
      checkName: "重点用户属性",
      isCheck: false,
      ipt:"picker",
      type:"06",
      columns:[{
        FiledValue:"0-普通用户",
        keyValue:0
      },{
        FiledValue:"1-重点用户",
        keyValue:1
      }],
      keyValue:1,
      FiledValue:"1-重点用户",
      index: 1
    },{
      display: false,
      checkName: "拉闸功能",
      isCheck: false,
      ipt:"picker",
      type:"07",
      columns:[{
        FiledValue:"0-不带拉闸",
        keyValue:0
      },{
        FiledValue:"1-带拉闸",
        keyValue:1
      }],
      keyValue:1,
      FiledValue:"1-带拉闸",
      index: 1
    },{
      display: false,
      checkName: "最大费率数",
      isCheck: false,
      type:"08",
      ipt:"number",
      FiledValue:"1"
    },{
      display: false,
      checkName: "采集终端地址",
      isCheck: false,
      type:"09",
      ipt:"number",
      FiledValue:"000000000000"
    },{
      display: false,
      checkName: "测量点端口号Hex",
      isCheck: false,
      type:"0A",
      ipt:"number",
      FiledValue:"1"
    },{
      display: false,
      checkName: "端口参数",
      isCheck: false,
      type:"0B",
      ipt:"multiple",
      columns:[{
        type: "0B_1",
        displayValue: "波特率",
        columns: [{
          FiledValue: "300",
          keyValue: "300"
        }, {
          FiledValue: "600",
          keyValue: "600"
        }, {
          FiledValue: "900",
          keyValue: "900"
        }, {
          FiledValue: "1200",
          keyValue: "1200"
        }, {
          FiledValue: "2400",
          keyValue: "2400"
        }, {
          FiledValue: "4800",
          keyValue: "4800"
        }, {
          FiledValue: "7200",
          keyValue: "7200"
        }, {
          FiledValue: "9600",
          keyValue: "9600"
        }, {
          FiledValue: "19200",
          keyValue: "19200"
        }],
        keyValue: "2400",
        FiledValue: "2400",
        index: 4
      }, {
        type: "0B_2",
        displayValue: "校验方式",
        columns: [{
          FiledValue: "无校验",
          keyValue: "0"
        }, {
          FiledValue: "偶校验",
          keyValue: "1"
        }, {
          FiledValue: "奇校验",
          keyValue: "2"
        }],
        keyValue: "1",
        FiledValue: "偶校验",
        index: 1
      }, {
        type: "0B_3",
        displayValue: "数据位",
        columns: [{
          FiledValue: "5",
          keyValue: "5"
        }, {
          FiledValue: "6",
          keyValue: "6"
        }, {
          FiledValue: "7",
          keyValue: "7"
        }, {
          FiledValue: "8",
          keyValue: "8"
        }],
        keyValue: "8",
        FiledValue: "8",
        index: 3
      }, {
        type: "0B_4",
        displayValue: "停止位",
        columns: [{
          FiledValue: "1位",
          keyValue: "0"
        }, {
          FiledValue: "1.5位",
          keyValue: "1"
        }, {
          FiledValue: "2位",
          keyValue: "2"
        }],
        keyValue: "0",
        FiledValue: "1位",
        index: 0
      }],
      FiledValue: "1200,1,8,0"
    },{
      display: true,
      checkName: "CT变比",
      isCheck: false,
      type:"0C",
      ipt:"number",
      FiledValue:"10"
    },{
      display: true,
      checkName: "PT变比",
      isCheck: false,
      type:"0D",
      ipt:"number",
      FiledValue:"1"
    }],
    isPicker: ""
  },

  onLoad: function (options) {
    debounceNumber = this.debounce(this.setDatas, 500)
    let IAddress = options.IAddress;
    let checkList = this.data.checkList;
    if(IAddress.slice(1)==4){
      checkList[12].FiledValue = 1; 
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
              if(res.data.Data[0].Fn == "00000000"){
                _that.showModal({
                  msg: "无该信息点设备"
                })
                _that.setData({
                  isPopup: false
                })
                return;
              }
              _that.showModal({
                msg: "读取成功"
              })
              let checkList = _that.data.checkList
              let resData = res.data.Data
              for(let j in resData){
                if(resData[j].Fn.substring(0,2) === "0F"){
                  for(let i in checkList){
                    if(checkList[i].ipt === "picker"){
                      checkList[i].keyValue = resData[j].Models[i].FiledValue
                      for(let k in checkList[i].columns){
                        if(checkList[i].columns[k].keyValue == resData[j].Models[i].FiledValue){
                          checkList[i].FiledValue = checkList[i].columns[k].FiledValue;
                          checkList[i].index = k;
                        }
                      }
                    }else if(checkList[i].ipt === "multiple"){
                      let multipleArr = resData[j].Models[i].FiledValue.split(',')
                      for(let l in multipleArr){
                        for(let m in checkList[i].columns[l].columns){
                          if(checkList[i].columns[l].columns[m].keyValue == multipleArr[l]){
                            checkList[i].columns[l].keyValue = multipleArr[l];
                            checkList[i].columns[l].FiledValue = checkList[i].columns[l].columns[m].FiledValue;
                            checkList[i].columns[l].index = m;
                          }
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
                      }else if(checkList[i].ipt === "multiple"){
                        let multipleArr = resData[j].Models[0].FiledValue.split(',')
                        for(let l in multipleArr){
                          for(let m in checkList[i].columns[l].columns){
                            if(checkList[i].columns[l].columns[m].keyValue == multipleArr[l]){
                              checkList[i].columns[l].keyValue = multipleArr[l];
                              checkList[i].columns[l].FiledValue = checkList[i].columns[l].columns[m].FiledValue;
                              checkList[i].columns[l].index = m;
                            }
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
    _that.setData({ isFull, checkList, isPicker: "", isMultiplePicker: "" }) 
  },
 //选择单项
  onChange: function(e) {
    var _that = this;
    var i = e.currentTarget.dataset.index;
    var checkList = _that.data.checkList;
    var isFull = false;
    checkList[i].isCheck = !checkList[i].isCheck;
    _that.setData({ checkList, isFull, isPicker: "", isMultiplePicker: "" })
  },
  reseverNumber(e){
    this.setData({
      isPicker: "",
      isMultiplePicker: ""
    })
    debounceNumber(e.detail.value, e.currentTarget.dataset.index);
  },
  showPicker(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      isPicker: this.data.checkList[index].type
    })
  },
  reseverPointIndex(e){
    this.setData({
      pointIndex: e.detail.value
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

  showMultiplePicker(e){
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    this.setData({
      isMultiplePicker: this.data.checkList[index].columns[index2].type
    })
  },
  multiplePickerConfirm(e){
    var _that = this;
    let listIndex = e.detail.index, 
      keyValue = e.detail.value.keyValue,
      FiledValue = e.detail.value.FiledValue,
      checkList = this.data.checkList,
      index = e.currentTarget.dataset.index,
      index2 = e.currentTarget.dataset.index2;
    checkList[index].columns[index2].index = listIndex, 
    checkList[index].columns[index2].FiledValue = FiledValue
    checkList[index].columns[index2].keyValue = keyValue;
    checkList[index].FiledValue = checkList[index].columns.map((obj) => {
        return obj.keyValue
    }).join(",")
    _that.setData({
      isMultiplePicker: "",
      checkList: checkList
    })
  },
  multiplePickerCancel(){
    this.setData({
      isMultiplePicker: ""
    })
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
      "Fn": "0F0080E0",
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
      "Data": data.length ===14 ? dataObj : data
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
      "Fn": "0F0080E0",
      "Pn": "P" + _that.data.pointIndex,
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
          "Pn": "P" + _that.data.pointIndex,
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
      "Address":util.getNWAddress(_that.data.IAddress),
      "Afn":"04",//读 10 设 04
      "Data": data.length === 14 ? dataObj : data
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
  setDatas(content, index){
    let checkList = this.data.checkList
    checkList[index].FiledValue = content;
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