// pages/setF3/setF3.js
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const util = require("../../utils/util.js");
const app = getApp();
import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * mainIp 主用ip mainIp1.mainIp2.mainIp3.mainIp4:mainIp5
     * reseverIp 备用ip reseverIp1.reseverIp2.reseverIp3.reseverIp4:reseverIp5
     * apn APN
     * isPopup 是否显示蓝牙操作中的加载状态
     * isRead 蓝牙回复时判断是否 是读取数据 false则为设置命令，反之为读取命令
     */
    mainIp1: "",
    mainIp2: "",
    mainIp3: "",
    mainIp4: "",
    mainIp5: "",
    reseverIp1: "",
    reseverIp2: "",
    reseverIp3: "",
    reseverIp4: "",
    reseverIp5: "",
    apn: "",
    isPopup: false,
    isRead: false,
  },
  onLoad: function (options) {
    var IAddress = options.IAddress;
    if(IAddress){
      this.setData({ IAddress })
    }
    //实例化验证信息
    this.initValidate();
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
      if(_that.data.isRead){
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            console.log(res)
            const arr = res.data.Data[0].Models;
            _that.showModal({
              msg: "读取成功"
            })
            _that.setData({
              mainIp1: arr[0].FiledValue.split('.')[0],
              mainIp2: arr[0].FiledValue.split('.')[1],
              mainIp3: arr[0].FiledValue.split('.')[2],
              mainIp4: arr[0].FiledValue.split('.')[3].split(':')[0],
              mainIp5: arr[0].FiledValue.split(':')[1],
              reseverIp1: arr[1].FiledValue.split('.')[0],
              reseverIp2: arr[1].FiledValue.split('.')[1],
              reseverIp3: arr[1].FiledValue.split('.')[2],
              reseverIp4: arr[1].FiledValue.split('.')[3].split(':')[0],
              reseverIp5: arr[1].FiledValue.split(':')[1],
              apn: arr[2].FiledValue,
              isPopup: false
            })
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

  initValidate() {
    let rules = {
      mainIp: {
        required: true,
        range: [0,255]
      },
      mainPort: {
        required: true,
        range: [0,65535]
      },
      reseverIp: {
        required: true,
        range: [0,255]
      },
      reseverPort: {
        required: true,
        range: [0,65535]
      },
      apn: {
        required: true
      }
    }
    let message = {
      mainIp: {
        required: '请输入正确的主用IP地址',
        range: '请输入正确的主用IP地址'
      },
      mainPort: {
        required: "主用IP地址端口号不能为空",
        range: '请输入正确的主用IP地址端口'
      },
      reseverIp: {
        required: '请输入正确的备用IP地址',
        range: '请输入正确的备用IP地址'
      },
      reseverPort: {
        required: "备用IP地址端口号不能为空",
        range: '请输入正确的备用IP地址端口'
      },
      apn: {
        required: "APN不能为空"
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  },
  //form表单提交 设置操作
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
    var obj = {
      "Address":util.getAddress(_that.data.IAddress),
      "Afn":"10",
      "Data": [{
        "Fn": "F3",
        "Pn": "P0",
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
    var _that = this;
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
    var obj = {
      "Address":util.getAddress(_that.data.IAddress),
      "Afn":"04",
      "Data": [{
        "Fn": "F3",
        "Pn": "P0",
        "Models":[{
          "FiledValue": this.data.mainIp1 + '.' + this.data.mainIp2 + '.' + this.data.mainIp3 + '.' + this.data.mainIp4 + ':' + this.data.mainIp5
        },{
          "FiledValue": this.data.reseverIp1 + '.' + this.data.reseverIp2 + '.' + this.data.reseverIp3 + '.' + this.data.reseverIp4 + ':' + this.data.reseverIp5
        },{
          "FiledValue": this.data.apn
        }]
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

  showModal(error){
    wx.showModal({
      title: '提示',
      content: error.msg,
      showCancel:false
    })
  },


  mainIpt1(e){
    this.setData({ mainIp1: e.detail.value })
  },
  mainIpt2(e){
    this.setData({ mainIp2: e.detail.value })
  },
  mainIpt3(e){
    this.setData({ mainIp3: e.detail.value })
  },
  mainIpt4(e){
    this.setData({ mainIp4: e.detail.value })
  },
  mainIpt5(e){
    this.setData({ mainIp5: e.detail.value })
  },
  reseverIpt1(e){
    this.setData({ reseverIp1: e.detail.value })
  },
  reseverIpt2(e){
    this.setData({ reseverIp2: e.detail.value })
  },
  reseverIpt3(e){
    this.setData({ reseverIp3: e.detail.value })
  },
  reseverIpt4(e){
    this.setData({ reseverIp4: e.detail.value })
  },
  reseverIpt5(e){
    this.setData({ reseverIp5: e.detail.value })
  },
  apnIpt(e){
    this.setData({ apn: e.detail.value })
  }
})