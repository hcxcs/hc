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
    isRead: false, 
    isFull: false, //是否全选
    checkList:[{
      checkName: "ERC1:数据初始化和版本变更记录",
      isCheck: false
    },{
      checkName: "ERC2:参数丢失记录",
      isCheck: false
    },{
      checkName: "ERC3:参数变更记录",
      isCheck: false
    },{
      checkName: "ERC4:状态量变位记录",
      isCheck: false
    },{
      checkName: "ERC5:遥控跳闸记录",
      isCheck: false
    },{
      checkName: "ERC6:功控跳闸记录",
      isCheck: false
    },{
      checkName: "ERC7:电控跳闸记录",
      isCheck: false
    },{
      checkName: "ERC8:电能表参数变更",
      isCheck: false
    },{
      checkName: "ERC9:电流回路异常",
      isCheck: false
    },{
      checkName: "ERC10:电压回路异常",
      isCheck: false
    },{
      checkName: "ERC11:相续异常",
      isCheck: false
    },{
      checkName: "ERC12:电能表时间超差",
      isCheck: false
    },{
      checkName: "ERC13:电表故障信息",
      isCheck: false
    },{
      checkName: "ERC14:终端停/上电事件",
      isCheck: false
    },{
      checkName: "ERC15:谐波越限告警",
      isCheck: false
    },{
      checkName: "ERC16:直流模拟量越限记录",
      isCheck: false
    },{
      checkName: "ERC17:电压电流不平衡越限",
      isCheck: false
    },{
      checkName: "ERC18:电容器投切自锁记录",
      isCheck: false
    },{
      checkName: "ERC19:购电参数设置记录",
      isCheck: false
    },{
      checkName: "ERC20:密码错误记录",
      isCheck: false
    },{
      checkName: "ERC21:终端故障记录",
      isCheck: false
    },{
      checkName: "ERC22:有功总电量差动越限事件记录",
      isCheck: false
    },{
      checkName: "ERC23:备用",
      isCheck: false
    },{
      checkName: "ERC24:电压越限记录",
      isCheck: false
    },{
      checkName: "ERC25:电流越限记录",
      isCheck: false
    },{
      checkName: "ERC26:视在功率越限记录",
      isCheck: false
    },{
      checkName: "ERC27:电能表示度下降",
      isCheck: false
    },{
      checkName: "ERC28:电能量超差",
      isCheck: false
    },{
      checkName: "ERC29:电能表飞走",
      isCheck: false
    },{
      checkName: "ERC30:电能表停走",
      isCheck: false
    },{
      checkName: "ERC31:终端485抄表失败",
      isCheck: false
    },{
      checkName: "ERC32:终端与主站通信流量超门限",
      isCheck: false
    },{
      checkName: "ERC33:电能表运行状态字变位",
      isCheck: false
    },{
      checkName: "ERC34:CT异常",
      isCheck: false
    },{
      checkName: "ERC35:发现未知电表",
      isCheck: false
    },{
      checkName: "ERC36:控制输出回路开关接入状态量变更记录",
      isCheck: false
    },{
      checkName: "ERC37:电能表开表盖事件记录",
      isCheck: false
    },{
      checkName: "ERC38:电能表开端钮盒事件记录",
      isCheck: false
    },{
      checkName: "ERC39:补抄失败事件记录",
      isCheck: false
    },{
      checkName: "ERC40:磁场异常事件记录",
      isCheck: false
    },{
      checkName: "ERC41:对时事件记录",
      isCheck: false
    },{
      checkName: "ERC42:电能表时间偏差越限事件",
      isCheck: false
    },{
      checkName: "ERC43:备用",
      isCheck: false
    },{
      checkName: "ERC44:备用",
      isCheck: false
    },{
      checkName: "ERC45:终端电池失效",
      isCheck: false
    },{
      checkName: "ERC46:备用",
      isCheck: false
    },{
      checkName: "ERC47:备用",
      isCheck: false
    },{
      checkName: "ERC48:备用",
      isCheck: false
    },{
      checkName: "ERC49:备用",
      isCheck: false
    },{
      checkName: "ERC50:备用",
      isCheck: false
    },{
      checkName: "ERC51:控制终端告警",
      isCheck: false
    },{
      checkName: "ERC52:备用",
      isCheck: false
    },{
      checkName: "ERC53:备用",
      isCheck: false
    },{
      checkName: "ERC54:备用",
      isCheck: false
    },{
      checkName: "ERC55:备用",
      isCheck: false
    },{
      checkName: "ERC56:备用",
      isCheck: false
    },{
      checkName: "ERC57:备用",
      isCheck: false
    },{
      checkName: "ERC58:备用",
      isCheck: false
    },{
      checkName: "ERC59:备用",
      isCheck: false
    },{
      checkName: "ERC60:通信测试请求事件",
      isCheck: false
    },{
      checkName: "ERC61:备用",
      isCheck: false
    },{
      checkName: "ERC62:备用",
      isCheck: false
    },{
      checkName: "ERC63:备用",
      isCheck: false
    },{
      checkName: "ERC64:备用",
      isCheck: false
    }]
  },

  onLoad: function (options) {
    var IAddress = options.IAddress;
    var terminalId = options.terminalId;
    if(IAddress){
      this.setData({ IAddress, terminalId })
    }
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
            var reArr = res.data.Data[0].Models[0].FiledValue.split('');
            var checkList = _that.data.checkList;
            for(let i in checkList){
              if(reArr[i] == "1"){
                checkList[i].isCheck = true;
              }
            }
            _that.showModal({
              msg: "读取成功"
            })
            _that.setData({
              isPopup: false,
              checkList: checkList,
            })
            
          }
        })
      }else{
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            _that.setData({
              isPopup: false,
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

  orderRead: function(){
    var _that = this;
    var obj = {
      "Address": util.getAddress(_that.data.IAddress),
      "Afn":"10",
      "Data": [{
        "Fn": "F9",
        "Pn": "P0",
        "Models":[]
      }]
    }
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
    var _that = this, str = "";
    var checkList = _that.data.checkList;
    for(var i in checkList){
      if(checkList[i].isCheck){
        str += "1";
      }else{
        str += "0";
      }
    }
    var obj = {
      "Address":util.getAddress(_that.data.IAddress),
      "Afn":"04",
      "Data": [{
        "Fn": "F9",
        "Pn": "P0",
        "Models":[{
          "FiledValue": str
        },{
          "FiledValue": str
        }]
      }]
    }
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