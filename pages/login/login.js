// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    username: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    wx.getSystemInfo({
      success: function (res) {
        _that.setData({
          height: res.windowHeight - 5
        });
      }
    });
  },
  
  nameChange: function(e){
    this.setData({
      username: e.detail
    })
  },

  pwdChange: function(e){
    this.setData({
      password: e.detail
    })
  },

  goLogin: function(){
    var _that = this;

    var userName = _that.data.username, pwd = _that.data.password;
    if(userName==""){
      _that.showToast("请输入用户名");return;
    }
    if(pwd==""){
      _that.showToast("请输入密码");return;
    }else{
      wx.request({
        url: app.globalData.requestUrl + '/api/userinfo/UserLoginInfoAsync',
        data: {
          userName: userName,
          userPwd: pwd
        },
        success: function(res){
          console.log(res)
          if(res.statusCode == "200"){
            wx.setStorageSync('hc_userId', res.data.Id);
            wx.setStorageSync('hc_areaId', res.data.AreaId);
            wx.navigateBack({
              delta: 1,
            })
          }else if(res.statusCode == "204"){
            _that.showToast("登录信息有误");return;
          }
          // if(res.data == "False"){
          //   _that.showToast("登录信息有误");return;
          // }else{
          //   wx.setStorageSync('hc_userId', res.data.Id);
          //   wx.setStorageSync('hc_areaId', res.data.AreaId);
          //   wx.navigateBack({
          //     delta: 1,
          //   })
          // }
        }
      })

    }
  },

  showModal(error){
    wx.showModal({
      title: '提示',
      content: error,
      showCancel:false
    })
  },

  showToast(error){
    wx.showToast({
      image: '/image/warn.png',
      title: error,
      duration: 2000
    })
  },
})