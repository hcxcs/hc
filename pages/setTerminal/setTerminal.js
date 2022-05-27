const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
  /**
   * 该页面只显示只读指令
   */

Page({
  data: {
    index: 0, //指令列表索引
    mIndex: 0, //监测终端列表索引
    isMonitor: false,  //判断选中的指令是否需要选择监测终端
    isPicker: false, //是否显示指令列表
    isPicker2: false,  //是否显示监测终端列表
    columns: [],  //指令列表数据合集
    monitor: [], //监测终端列表数据合集
    F10: [], //F10指令回复数据合集
    F25: [], //F25指令回复数据合集
    F2: [], //F2指令回复数据合集
    isPopup: false, //是否显示蓝牙操作中的加载状态
    orderIndex: 1,
    PointIndex: 0
  },

  onLoad: function (options) {
    var _that = this;
    var IAddress = options.IAddress;
    var terminalId = options.terminalId;
    if(IAddress){
      _that.setData({ IAddress, terminalId })
    }
    //获取指令列表
    wx.request({
      url: app.globalData.requestUrl + '/api/instructions/GetList',
      success(res){
        const columns = res.data.rows;
        _that.setData({ columns })
      }
    })
  },

  onShow: function () {
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
    var _that = this;
    //关闭蓝牙则跳转首页
    onfire.on("onBLECloseSuccess", function(data){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    });
    onfire.on("onBLEValueChangeOnfire", function(data){
      wx.request({
        url: app.globalData.requestUrl + '/api/terminal/Parse',
        data: { 
          hexString: data
        },
        success: function(res){
          //蓝牙收到回复 取消加载状态
          _that.setData({
            isPopup: false
          })
          //type判断是什么指令收到的蓝牙回复
          const type = _that.data.SDID.split('-')[1];
          const arr = res.data.Data[0].Models;
          if(type == "F10"){
            if(res.statusCode == "204"){
              _that.setData({
                orderIndex: 1
              })
            }else if(res.statusCode == "200"){
              const F10 = _that.data.F10.concat(arr);
              const orderIndex = _that.data.orderIndex*1 + 1
              _that.setData({ F10, F25: [], orderIndex, F2: [] })
              //_that.addTerminal();
            }
          }else if(type == "F25"){
            // const F25 = _that.data.F25.concat(arr);
            const F25 = arr;
            _that.setData({ F2: [], F10: [], F25, orderIndex: 1 })
          }else if(type == "F2"){
            const F2 = arr;
            _that.setData({ F2, F10: [], F25: [], orderIndex: 1 })
          }
        }
      })
    })
  
  },

  onUnload: function(){
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },

  showPicker: function(){
    this.setData({
      isPicker: true
    })
  },

  showMonitor: function(){
    this.setData({
      isPicker2: true
    })
  },
  //选择指令后判断该指令是否需要加载监测终端
  pickerConfirm: function(obj){
    var _that = this;
    const index = obj.detail.index;
    const CmdName = obj.detail.value.CmdName;
    const SDID = obj.detail.value.SDID;
    const Type = obj.detail.value.Type;
    _that.setData({ index, CmdName, SDID, Type, isPicker: false })
    if(Type == 1){
      wx.request({
        url: app.globalData.requestUrl + "/api/monitoring/GetList",
        data: {
          // interactivId: 14
          interactivId: _that.data.terminalId
        },
        success: function(res){
          const singleList = res.data.singleList;
          const threeList = res.data.threeList;
          const monitor = [];
          for(var i in singleList){
            monitor.push({
              FiledValue: "00" + singleList[i][0].No.slice(2),
              PointIndex: singleList[i][0].PointIndex
            })
          }
          for(var i in threeList){
            monitor.push({
              FiledValue: threeList[i].No,
              PointIndex: threeList[i].PointIndex           
            })
          }
          _that.setData({ monitor, isMonitor: true })
        }
      })
    }else{
      _that.setData({
        isMonitor: false
      })
    }
    
  },

  pickerCancel: function(){
    this.setData({
      isPicker: false
    })
  },
  
  monitorConfirm: function(obj){
    var _that = this;
    const index = obj.detail.index;
    const FiledValue = obj.detail.value.FiledValue;
    const PointIndex = obj.detail.value.PointIndex;
    _that.setData({
      isPicker2: false,
      mIndex: index,
      FiledValue: FiledValue,
      PointIndex: PointIndex
    })
  },

  monitorCancel: function(){
    this.setData({
      isPicker2: false
    })
  },

  addTerminal: function(){
    var _that = this;
    var SDID = _that.data.SDID.split('-')[1], Type = _that.data.Type, FiledValue = _that.data.FiledValue;
    if(!SDID){
      _that.showModal({
        msg: "请选择指令！"
      });
      return;
    }else if(Type == 1 && !FiledValue){
      _that.showModal({
        msg: "请选择监测终端！"
      });
      return;
    }
    var obj;
    if(SDID == "F25"){
      obj = {
        "Address": util.getAddress(_that.data.IAddress),
        "Afn":"10",//读 10 设 04
        "Data": [{
          "Fn": SDID,
          "Pn": "P" + _that.data.PointIndex,
          "Models": []
        }]
      }
    }else if(SDID == "F10"){
      obj = {
        "Address": util.getAddress(_that.data.IAddress),
        "Afn":"10",//读 10 设 04
        "Data": [{
          "Fn": SDID,
          "Pn": "P" + _that.data.PointIndex,
          "Models": [{"FiledValue": _that.data.orderIndex}]
        }]
      }
    }else if(SDID == "F2"){
      obj = {
        "Address": util.getAddress(_that.data.IAddress),
        "Afn":"10",//读 10 设 04
        "Data": [{
          "Fn": SDID,
          "Pn": "P" + _that.data.PointIndex,
          "Models": []
        }]
      }
    }
    
    wx.request({
      url: app.globalData.requestUrl + '/api/terminal/Convert',
      data: {
        frameJson: JSON.stringify(obj)
      },
      success: function(res){
        _that.setData({
          isPopup:true
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

  showToast(title){
    wx.showToast({
      title: title,
      image: '/image/warn.png',
      duration: 2000
    })
  },
})