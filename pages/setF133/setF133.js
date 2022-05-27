// pages/setF133/setF133.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
import WxValidate from '../../utils/WxValidate.js'
Page({
  /**
   * unitList 指令的单位列表，方便后面数据的格式化
   * orderList 指令列表 包括名称、单位
   * valueList 指令数值列表，未修改情况下是默认值
   */
  data: {
    isPopup: false,
    isPicker2: false, //是否显示监测终端列表
    mIndex: 0, //监测终端下标
    monitor: [], //监测终端列表
    unitList: ["V","秒","%","V","秒","%","A","秒","%","A","秒","%","kVA","秒","%","kVA","秒","%","kVA","秒","%","%","秒","%","%","秒","%","kW","秒","%","kW","秒","%","kW","秒","%","kW","秒","%","kW","秒","%","︒C","︒C","秒","︒C","︒C","秒","︒C","︒C","秒","v","秒","秒","秒","kW","秒","%","kVA","秒","%","V","V","%","%"],
    orderList: [{
      "des": "过压判别参数",
      "data": [{
        "title": "电压上上限(过压门限)",
        "unit": "V",
        "index": 0
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 1
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 2
      }]
    }, {
      "des": "欠压判别参数",
        "data": [{
        "title": "电压下下限(欠压门限)",
        "unit": "V",
        "index": 3
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 4
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 5
      }]
    }, {
      "des": "过流判别参数",
        "data": [{
        "title": "相电流上上限(过流门限)",
        "unit": "A",
        "index": 6
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 7
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 8
      }]
    }, {
      "des": "超额定电流判别参数",
        "data": [{
        "title": "相电流上限(额定电流门限)",
        "unit": "A",
        "index": 9
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 10
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 11
      }]
    }, {
      "des": "视在功率超上上限判别参数",
        "data": [{
        "title": "视在功率上上限",
        "unit": "kVA",
        "index": 12
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 13
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 14
      }]
    }, {
      "des": "视在功率超上限判别参数",
        "data": [{
        "title": "视在功率上限",
        "unit": "kVA",
        "index": 15
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 16
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 17
      }]
    }, {
      "des": "视在功率超下限判别参数",
        "data": [{
        "title": "视在功率下限",
        "unit": "kVA",
        "index": 18
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 19
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 20
      }]
    }, {
      "des": "三相电压不平衡超限判别参数",
        "data": [{
        "title": "三相电压不平衡限值",
        "unit": "%",
        "index": 21
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 22
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 23
      }]
    }, {
      "des": "三相电流不平衡超限判别参数",
        "data": [{
        "title": "三相电流不平衡限值",
        "unit": "%",
        "index": 24
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 25
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 26
      }]
    }, {
      "des": "当前正向有功总需量越上上限判别参数",
        "data": [{
        "title": "当前正向有功总需量上上限",
        "unit": "kW",
        "index": 27
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 28
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 29
      }]
    }, {
      "des": "当前正向有功总需量越上限判别参数",
        "data": [{
        "title": "当前正向有功总需量上限",
        "unit": "kW",
        "index": 30
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 31
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 32
      }]
    }, {
      "des": "当前总有功功率越上上限判别参数",
        "data": [{
        "title": "当前总有功功率上上限",
        "unit": "kW",
        "index": 33
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 34
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 35
      }]
    }, {
      "des": "当前总有功功率越上限判别参数",
        "data": [{
        "title": "当前总有功功率上限",
        "unit": "kW",
        "index": 36
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 37
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 38
      }]
    }, {
      "des": "当前总有功功率越下限判别参数",
        "data": [{
        "title": "当前总有功功率下限",
        "unit": "kW",
        "index": 39
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 40
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 41
      }]
    }, {
      "des": "三相温度越限判别参数",
        "data": [{
        "title": "A 相位温度越限门限值",
        "unit": "︒C",
        "index": 42
      }, {
        "title": "A 相位温度越限恢复门限值",
        "unit": "︒C",
        "index": 43
      }, {
        "title": "A 相位温度越限持续时间",
        "unit": "秒",
        "index": 44
      }, {
        "title": "B 相位温度越限门限值",
        "unit": "︒C",
        "index": 45
      }, {
        "title": "B 相位温度越限恢复门限值",
        "unit": "︒C",
        "index": 46
      }, {
        "title": "B 相位温度越限持续时间",
        "unit": "秒",
        "index": 47
      }, {
        "title": "C 相位温度越限门限值",
        "unit": "︒C",
        "index": 48
      }, {
        "title": "C 相位温度越限恢复门限值",
        "unit": "︒C",
        "index": 49
      }, {
        "title": "C 相位温度越限持续时间",
        "unit": "秒",
        "index": 50
      }]
    }, {
      "des": "电压回路异常判别参数",
        "data": [{
        "title": "电压断相门限",
        "unit": "V",
        "index": 51
      }, {
        "title": "电压回路异常持续时间",
        "unit": "秒",
        "index": 52
      }]
    },  {
      "des": "电流回路异常判别参数",
        "data": [{
        "title": "电流回路异常持续时间",
        "unit": "秒",
        "index": 53
      }]
    }, {
      "des": "相序异常判别系数",
        "data": [{
        "title": "相序异常持续时间",
        "unit": "秒",
        "index": 54
      }]
    }, {
      "des": "当前总有功功率越下下限判别参数",
        "data": [{
        "title": "当前总有功功率下下限",
        "unit": "kW",
        "index": 55
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 56
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 57
      }]
    }, {
      "des": "视在功率超下下限判别参数",
        "data": [{
        "title": "视在功率下下限",
        "unit": "kVA",
        "index": 58
      }, {
        "title": "越限持续时间",
        "unit": "秒",
        "index": 59
      }, {
        "title": "越限恢复系数",
        "unit": "%",
        "index": 60
      }]
    }, {
      "des": "电压合格判别参数",
        "data": [{
        "title": "电压合格上限",
        "unit": "V",
        "index": 61
      }, {
        "title": "电压合格下限",
        "unit": "V",
        "index": 62
      }]
    }, {
      "des": "功率因数分段限值",
        "data": [{
        "title": "功率因数分段限值 1",
        "unit": "%",
        "index": 63
      }, {
        "title": "功率因数分段限值 2",
        "unit": "%",
        "index": 64
      }]
    }],
    valueList: [{
      FiledValue: "264.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "150.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "7.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "6.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "10.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "9.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "3.0" //视在功率下限
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "30.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "30.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "10.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "9.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "10.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "9.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "3.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "-5.0"
    },{
      FiledValue: "70.0"
    },{
      FiledValue: "60.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "70.0"
    },{
      FiledValue: "60.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "70.0"
    },{
      FiledValue: "60.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "154.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "60"
    },{
      FiledValue: "60"
    },{
      FiledValue: "1.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "5.0"
    },{
      FiledValue: "1.0"
    },{
      FiledValue: "60"
    },{
      FiledValue: "5.0"
    },{
      FiledValue: "240.0"
    },{
      FiledValue: "178.0"
    },{
      FiledValue: "750.0"
    },{
      FiledValue: "500.0"
    }],
    isRead: false,
    PointIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    var IAddress = options.IAddress;
    var terminalId = options.terminalId;
    if(!IAddress){
      _that.setData({ IAddress, terminalId })
    }
    wx.request({
      url: app.globalData.requestUrl + '/api/monitoring/GetList',
      data: {
        interactivId: _that.data.terminalId
        // interactivId: 14
      },
      success(res){
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
        _that.setData({ monitor })
      }
    })
    _that.initValidate();
  },

  onShow: function () {
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
    var _that = this;
    onfire.on("onBLECloseSuccess",function(data){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    });
    onfire.on("onBLEValueChangeOnfire",function(data){
      if(_that.data.isRead){
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            _that.showModal({
              msg: "读取成功"
            })
            _that.setData({
              isPopup: false,
              valueList: res.data.Data[0].Models
            })
          }
        })
      }else{
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/parse/' + data,
          method:"post",
          data: { 
            //hexstring: data
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
      }
    })
  
  },

  onUnload: function(){
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },

  orderInput: function(event){
    const order = event.detail.value, i = event.currentTarget.dataset.index, unit = event.currentTarget.dataset.unit, valueList = this.data.valueList;
    // if(unit != "秒"){
    //   valueList[i].FiledValue = parseFloat(order).toFixed(1);
    // }else{
    //   valueList[i].FiledValue = parseInt(order);
    // }
    valueList[i].FiledValue = order;
    this.setData({ valueList })
  },

  initValidate() {
    let rules = {
      order: {
        required: true
      }
    }
    let message = {
      order: {
        required: '表单内容不能为空'
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },

  orderForm: function(data){
    const params = data.detail.value;
    if (!this.WxValidate.checkForm(params)) 
    {
       //表单元素验证不通过，此处给出相应提示
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      return false;
    }
    this.orderSet();
  },

  orderRead: function(){
    var _that = this;
    var FiledValue = _that.data.FiledValue;
    // if(!FiledValue){
    //   _that.showModal({
    //     msg: "请选择监测终端！"
    //   });
    //   return;
    // }
    _that.setData({
      isRead: true,
      isPopup: true
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
    var obj = {
      "Address": util.getAddress(_that.data.IAddress),
      "Afn":10,
      "Data": [{
        "Fn": "F133",
        "Pn": "P" + _that.data.PointIndex,
        "Models":[]
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

  orderSet: function(){
    const _that = this;
    var FiledValue = _that.data.FiledValue;
    // if(!FiledValue){
    //   _that.showModal({
    //     msg: "请选择监测终端！"
    //   });
    //   return;
    // }
    _that.setData({
      isRead: false,
      isPopup: true
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
    const data = _that.data.valueList, dataList = [], unitList = _that.data.unitList;
    for(var i in data){
      if(unitList[i] == "A"){
        dataList.push({
          FiledValue: parseFloat(data[i].FiledValue).toFixed(3),
          Unit: unitList[i]
        })
      }
      else if(unitList[i] == "kVA" || unitList[i] == "kW"){
        dataList.push({
          FiledValue: parseFloat(data[i].FiledValue).toFixed(4),
          Unit: unitList[i]
        })
      }
      else if(unitList[i] != "秒"){
        dataList.push({
          FiledValue: parseFloat(data[i].FiledValue).toFixed(1),
          Unit: unitList[i]
        })
      }
      else{
        dataList.push({
          FiledValue: parseInt(data[i].FiledValue),
          Unit: unitList[i]
        })
      }
    } 
    // const obj = {
    //   "Fn": "04-F133",
    //   "Pn": "P" + _that.data.PointIndex, // + _that.data.PointIndex
    //   "Address": util.getAddress(_that.data.IAddress),
    //   "Models": dataList
    // }
    var obj = {
      "Address":"05710004",
      "Afn":"04",
      "Data": [{
        "Fn": "F133",
        "Pn": "P" + _that.data.PointIndex,
        "Models":dataList
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

  showMonitor: function(){
    this.setData({
      isPicker2: true
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

  showModal(error){
    wx.showModal({
      title: '提示',
      content: error.msg,
      showCancel:false
    })
  },
})