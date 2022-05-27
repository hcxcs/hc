const app = getApp()
var QQMapWx=require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    courtsId: "", //台区id
    IAddress: "", //终端地址
    ICode: "", //资产编码
    addFlag: true
  },
  onLoad: function(options) {
    if(options.courtsId){
      this.setData({
        courtsId: options.courtsId,
        courtsName: options.courtsName
      })
    }
    // 实例化API核心类
    qqmapsdk=new QQMapWx({
      key:'PIMBZ-2L333-PBR3I-YAJ46-ZN3GT-B3FJQ'
    });
  },

  //扫码能效交互终端地址
  getScancode: function() {
    var _that = this;
    wx.scanCode({
      success: (res) => {
        if(res.errMsg == "scanCode:ok"){
          let resAddress;
          if(res.scanType == "CODE_128") resAddress = res.result;
          else{
            var arr = res.result.split('\n');
            resAddress = arr[2].split('：')[1];
          }
          if(resAddress.length == 9||resAddress.length == 13){
              wx.getLocation({
                type: 'gcj02',
                //定位成功，更新定位结果
                success: function (res2) { 
                  const latitude = res2.latitude; //纬度
                  const longitude = res2.longitude; //经度
                  const IAddress = resAddress;
                  //经纬度转化为地址
                  _that.getLocal(latitude, longitude);
                  _that.setData({ latitude, longitude, IAddress })
                },
                //定位失败回调
                fail: function () {
                  _that.showModal('请确认手机是否打开手机定位功能');
                }
              })            
          }else{
            _that.showModal('请扫码正确的交互终端地址');
          }
        }
      }
    })
  },
  //获取指定经纬度的地理位置 省市区
  getLocal: function (latitude, longitude) {
    let _that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        _that.setData({
          province: province,//省
          city: city,//市
          district: district //区
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //手动输入终端地址
  addressInput: function(event){
    var _that = this;
    if(this.data.longitude == undefined){
      wx.getLocation({
        type: 'gcj02',
        //定位成功，更新定位结果
        success: function (res2) { 
          const latitude = res2.latitude; //纬度
          const longitude = res2.longitude; //经度
          //经纬度转化为地址
          //_that.getLocal(latitude, longitude);
          _that.setData({ latitude, longitude })
        },
        //定位失败回调
        fail: function () {
          _that.showModal('请确认手机是否打开手机定位功能');
        }
      })  
    }
    this.setData({
      IAddress: event.detail.value
    })
  },
  //输入资产编码
  codeInput: function(event){
    this.setData({
      ICode: event.detail.value
    })
  },
  //添加
  addTerminal: function(){
    var _that = this;
    if(this.data.IAddress.length != 9&&this.data.IAddress.length != 13){
      this.showModal("请输入正确的交互终端地址");
    }else{
      var obj = {
        IAddress: this.data.IAddress,
        ICode: this.data.ICode,
        Coordinate: this.data.longitude + "," + this.data.latitude
      }
      if(this.data.addFlag){
        this.setData({
          addFlag: false
        })
        wx.request({
          url: app.globalData.requestUrl + "/api/interactive/AddAsync",
          data: {
            areaId: _that.data.courtsId,
            interactiveTerminal: JSON.stringify(obj)
          },
          success: function(){
            wx.request({
              url: app.globalData.requestUrl + "/api/interactive/GetList",
              data: {
                areaId: _that.data.courtsId
              },
              success: function(res){
                let pages = getCurrentPages();
                pages[pages.length-2].setData({
                  terminalList: res.data
                })  
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
        })
      }
    }
  },
  showModal(error){
    wx.showModal({
      title: '提示',
      content: error,
      showCancel:false
    })
  }
})