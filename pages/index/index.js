
//获取应用实例
//DeviceInsert
const app = getApp()
Page({
  data: {
    courtsName: "选择台区",  //台区名称，默认情况为 选择台区
    terminalList: [], //选中台区下的能效交互终端设备
    show: false, //判断是否显示带有删除选项的ActionSheet 动作面板
    actions: [
      { name: '删除' }
    ],
  },

  onLoad(options){
    var _that = this;
    //看缓存中是否有登录信息和台区信息
    var userId = wx.getStorageSync('hc_userId'), courtsId = wx.getStorageSync('courtsId'), courtsName = wx.getStorageSync('courtsName');
    if(userId && courtsId){
      /**
       * 获取指定台区下的能效交互终端列表，返回值如下：
          Id: 设备id,
          IAddress: 设备地址 9位,
          ICode: 资产编码,
          Status: 设置状态 0在线 1离线,
          Coordinate: 设备添加时的经纬度 ,分割，前为经度 后为纬度,
          SignalStrength: 信号强度 暂无使用,
          TransmissionProgress: 传输进程 暂无使用,
          Timestamp: 添加时的时间
       */
      wx.request({
        url: app.globalData.requestUrl + "/api/interactive/GetList",
        data: {
          areaId: courtsId
        },
        success: function(res){
          _that.setData({
            courtsName: courtsName,
            courtsId: courtsId,
            terminalList: res.data
          })
        }
      })
    }
  },
  //前往添加该台区下的能效交互终端页面，在未选择台区的前提下无跳转并提示
  goScan(){
    var _that = this;
    if(!this.data.courtsId){
      wx.showModal({
        title: '提示',
        content: "请先选择台区",
        showCancel:false
      })
      return;
    }
    wx.navigateTo({
      url: '../addTerminal/addTerminal?courtsId=' + _that.data.courtsId + "&courtsName=" + _that.data.courtsName,
    })
  },
  //没有登录信息的情况下跳转登录页面 反之跳转选择台区页面
  showSelect(){
    if(!wx.getStorageSync('hc_userId')){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      wx.navigateTo({
        url: '../choiceRout/choiceRout',
      })
    }
  },
//切换用户
  go2detail: function(param){
    wx.navigateTo({
      url: '../login/login',
      })
  },

  //跳转能效交互终端的详情页面
  terminalDetails(e){
    const data = e.currentTarget.dataset;
    wx.navigateTo({
      //url: '../terminalDetails/terminalDetails?terminal=' + JSON.stringify(data.terminal),
      url: '/pages/bluetoothLogin/bluetoothLogin?terminal=' + JSON.stringify(data.terminal)
    })
  }, 
  //长按能效交互终端选项 询问是否删除该交互能效终端，delIndex 删除设备的坐标
  delTerminal(e){
    const data = e.currentTarget.dataset;
    this.setData({
      show: true,
      delIndex: data.index
    })
  },
  //取消删除
  cancelDel(){
    this.setData({
      show: false
    })
  },
  //点击删除选项，再次确认
  selectDel(event){
    var _that = this;
    wx.showModal({
      content: '确认删除该能效交互终端？',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.cancel) {
          _that.setData({
            show: false
          })
        } else {
          const terminalList = _that.data.terminalList;
          wx.request({
            url: app.globalData.requestUrl + "/api/interactive/DeleteAsync",
            data: { 
              id: terminalList[_that.data.delIndex].Id
            },
            success: function(res){
              if(res.data == "True"){
                terminalList.splice(_that.data.delIndex, 1);
                _that.setData({
                  terminalList: terminalList,
                  show: false
                })
              }
            }
          })
        }
      },
    })
  }
})