// pages/choiceRout/choiceRout.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: [], //所有台区的树形数据
    courtsName: "", //选中的台区名称
    courtsId: "", //选中的台区id
  },

  onLoad(){
    var _that = this;
    wx.request({
      url: app.globalData.requestUrl + "/api/area/GetTree?areaIds=" + wx.getStorageSync('hc_areaId'),
      success: function(res){
        const selectArray = res.data;
        _that.setData({ selectArray })
      }
    })
  },
  onShow(){
    var _that = this;
    wx.getSystemInfo({
      success(res){
        const selectHeight = res.windowHeight - 50;
        _that.setData({ selectHeight });
      }
    })
  },
  //确认选择台区，限制只能选择叶子节点
  checkRout(){
    var _that = this;
    if(!_that.data.courtsName){
      wx.showModal({
        title: '提示',
        content: "选择正确的台区！",
        showCancel:false
      })
      return;
    }else{
      //确认选择后获取该台区下的所有能效交互终端回调给上一个页面
      wx.request({
        url: app.globalData.requestUrl + "/api/interactive/GetList",
        data: {
          areaId: _that.data.courtsId
        },
        success: function(res){
          wx.setStorageSync('courtsId', _that.data.courtsId);
          wx.setStorageSync('courtsName', _that.data.courtsName);
          let pages = getCurrentPages();
          pages[pages.length-2].setData({
            courtsName: _that.data.courtsName,
            courtsId: _that.data.courtsId,
            terminalList: res.data
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    }
  },
  //点击台区事件
  tapItem: function (e) {
    const courtsId = e.detail.itemid;
    const courtsName = e.detail.value;
    if(!e.detail.children){
      this.setData({ courtsId, courtsName });
    }else{
      this.setData({ courtsId:"", courtsName:"" });
    }
  }
})