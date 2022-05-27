// pages/terminalDetails/terminalDetails.js
/**
 * 该页面主要分上下两部分 上面是能效交互终端的详细信息，也可对该交互终端进行蓝牙指令设置操作
 *                       下面是对该交互终端下的监测终端列表进行操作
 * 监测终端主要分为两种 三相表、单相表 地址长度都为12个字符，三相表已00开头，单相表分为A相（10开头）B相（20开头）C相（30开头）
 */
const bluetooth=require('../../utils/bluetooth.js');
const onfire=require('../../utils/onfire1.0.6.js');
const { addressFormatter } = require('../../utils/util.js');
const util = require("../../utils/util.js");
const app = getApp()
Page({
  data: {
    conAdd: true,
    singleList: [], //单相表列表
    threeList: [],  //三相表列表
    pointList: [], //单相表、三相表监测点集合
    monitorList: [], //单相表、三相表集合 地址(前两位不保存，单相表一组保留一个地址)，点位
    isBlueTooth: true, //是否已连接蓝牙设备
    orderIndex: 1, //
    isLoad: true,//页面是否是初始化
    radio: 0, //判断是否已选中删除的监测终端设备 >0时表示已选择
    isRead: true, //是否显示“读取”按钮，已读取后状态修改为false
    isDisable: false,  //是否禁用按钮，暂无使用
    isPopup: false, //是否显示蓝牙操作中的加载状态
    isDel: false,  //蓝牙收到回复后，判断是否 是删除操作
    conDel: false,  //确认删除操作后确认是否删除档案
    isEdit: false,  //蓝牙收到回复后，判断是否 是新增监测终端操作
    addMonitor: "",  //添加的监测终端地址
    addPoint: "",  //所有加载的监测终端地址中点位最大的一个，方便后面的添加，实验组
    point: "",  //所有加载的监测终端地址中点位最大的一个，方便后面的添加，对照组
    delMonitor: "",//待删除的监测终端地址
    singleImg:"single_empty.png",//信号强度图标
    SignalStrength:0//信号强度文字描述
  },
  onLoad: function (options) {
    var _that = this;
    if(!_that.data.isBlueTooth){
      bluetooth.closeBleConnettion();
    }
    let obj = JSON.parse(options.terminal);
    //通过options获取能效交互终端地址
    const terminalId = obj.Id, IAddress = obj.IAddress, ICode = obj.ICode, terminalStatus = obj.Status == 0? "在线" : "离线", Coordinate = (obj.Coordinate.split(',')[0]*1).toFixed(4) + ',' + (obj.Coordinate.split(',')[1]*1).toFixed(4);
    /**
     * terminalId 设备id；IAddress 设备地址；ICode 资产编码；terminalStatus 状态；Coordinate 坐标
     */
    _that.setData({ terminalId, IAddress, ICode, terminalStatus, Coordinate })
    //获取指定交互终端地址下的所有监测终端
    wx.request({
      url: app.globalData.requestUrl + "/api/monitoring/GetList",
      data: {
        interactivId: _that.data.terminalId
      },
      success: function(res){
        const singleList = res.data.singleList;
        const threeList = res.data.threeList;
        var pointList = [], monitorList = [];
        for(var i in singleList){
          pointList.push(singleList[i][0].PointIndex);
          monitorList.push({
            add: singleList[i][0].No.slice(2),
            point: singleList[i][0].PointIndex
          })
        }
        for(var j in threeList){
          pointList.push(threeList[j].PointIndex);
          monitorList.push({
            add: threeList[j].No.slice(2),
            point: threeList[j].PointIndex
          })
        }
        const point = Math.max.apply(null,pointList) + 1;
        _that.setData({ singleList, threeList, point, addPoint: point, pointList, monitorList })
      }
    })
    _that.readStrength();
  },

  onShow: function () {
    var _that = this;
    //每次显示页面是先卸载订阅再重新订阅 防止蓝牙收发两次
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
    if(_that.data.orderIndex == 0){
      _that.setData({
        orderIndex: 1
      })
    }
    //关闭蓝牙 直接跳转到首页
    onfire.on("onBLECloseSuccess", function(data){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    })
    onfire.on("onBLEValueChangeOnfire",function(data){
      if(_that.data.isDel){
        let flag = _that.data.delMonitor.slice(0,2), add = _that.data.delMonitor.slice(2), pointList = _that.data.pointList;
        let conDel = _that.data.conDel;
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            let order = res.data.Data;
            if(order[0].Models[0].FiledValue == 0){
              if(conDel){
                var str = "";
                if(flag != "10" && flag != "20" && flag != "30") str = flag + add;
                else str = "10" + add + "," + "20" + add + "," + "30" + add;
                // 移除档案
                wx.request({
                  url: app.globalData.requestUrl + "/api/monitoring/Delete",
                  data: {
                    interactiveId: _that.data.terminalId,
                    address: str
                  },
                  success: function(res){
                    if(res.data == "True"){
                      pointList.splice(pointList.indexOf(_that.data.radio*1),1);
                      var point = Math.max.apply(null,pointList) + 1
                      _that.showModal("删除成功！");
                      _that.setData({
                        orderIndex: 1,
                        isRead: false,
                        isDisable: false,
                        isPopup: false,
                        isDel: false,
                        conDel: false,
                        isEdit: false,
                        pointList, point,
                        addPoint: point
                      })
                      _that.readMonitor();
                    }
                  }
                })
              }else{
                _that.setData({
                  orderIndex: 1,
                  isRead: false,
                  isDisable: false,
                  isPopup: false,
                  isDel: false,
                  conDel: false,
                  isEdit: false
                })
              }
            }else{
              _that.showModal("删除失败！")
              _that.setData({
                isPopup: false
              })
            }
          }
        })  

      }else if(_that.data.isEdit){
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            if(res.statusCode == "200"){
              var addMonitor = _that.data.addMonitor, addPoint = _that.data.addPoint, flag = _that.data.addMonitor.slice(0, 2), 
                requestObj = [], pointList = _that.data.pointList, monitorList = _that.data.monitorList;
              if(flag != "10" && flag != "20" && flag != "30"){
                requestObj.push({
                  MAddress: addMonitor,
                  PhaseType: 0, //0三相表 1单相表
                  PointIndex: addPoint
                })
              }else{
                requestObj.push({
                  MAddress: "10" + addMonitor.slice(2),
                  PhaseType: 1,
                  PointIndex: addPoint
                },{
                  MAddress: "20" + addMonitor.slice(2),
                  PhaseType: 2,
                  PointIndex: addPoint
                },{
                  MAddress: "30" + addMonitor.slice(2),
                  PhaseType: 3,
                  PointIndex: addPoint
                })
              }
              wx.request({
                url: app.globalData.requestUrl + "/api/monitoring/AddAsync",
                data: {
                  interactivId: _that.data.terminalId, 
                  monitoringTerminal: JSON.stringify(requestObj),
                },
                success: function(res){
                  if(res.data == "True"){
                    _that.showModal("添加成功！");
                    pointList.push(addPoint);
                    monitorList.push({
                      add: addMonitor.slice(2),
                      point: addPoint
                    })
                    if(addPoint == _that.data.point){
                      _that.setData({
                        point: _that.data.point*1+1,
                        addPoint: _that.data.point*1+1,
                        addMonitor: "",
                        pointList, monitorList
                      })
                    }else{
                      _that.setData({
                        addPoint: _that.data.point,
                        addMonitor: "",
                        pointList, monitorList
                      })
                    }
                    _that.setData({
                      orderIndex: 1,
                      isRead: false,
                      isDisable: false,
                      isPopup: false,
                      isDel: false,
                      conDel: false,
                      isEdit: false
                    })
                    _that.readMonitor();
                  }
                }
              })
            }
          }
        }) 
      }else if(_that.data.isLoad){
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: { 
            hexString: data
          },
          success: function(res){
            let SignalStrength = res.data.Data[0].Models[0].FiledValue, singleImg;
            if(SignalStrength==0) singleImg = "single_empty.png";
            else if(SignalStrength>=1&&SignalStrength<=8) singleImg = "single_one.png";
            else if(SignalStrength>=9&&SignalStrength<=16) singleImg = "single_two.png";
            else if(SignalStrength>=17&&SignalStrength<=24) singleImg = "single_three.png";
            else if(SignalStrength>=25&&SignalStrength<=30) singleImg = "single_four.png";
            else if(SignalStrength>=31) singleImg = "single_full.png";
            _that.setData({
              isLoad: false, SignalStrength, singleImg
            })
          }
        })  
      }else if(_that.data.isRead){
        let flag  = false;
        // 读取
        if(_that.data.orderIndex == 1){
          _that.setData({
            threeList: [],
            singleList: []
          })
          flag = true;
        }else{
          flag = true;
        }
        if(flag){
          wx.request({
            url: app.globalData.requestUrl + '/api/terminal/Parse',
            data: {
              hexString: data
            },
            success: function(res){
              var order = res.data.Data;
              if(res.statusCode == "204"){
                _that.setData({
                  isDisable: false,
                  isRead: false,
                  isPopup: false,
                  orderIndex: 0
                })
                return;
              }else if(res.statusCode == "200"){
                if(order[0].Models.length == 0) return;
                if(order[0].Models[0].FiledValue == 255) return;
                var singleList = [],threeList = [];
                if(order[0].Models[0].FiledValue == 1){
                  if(order[2].Models[0].FiledValue == 1){
                    var address = order[1].Models[0].FiledValue.slice(2);
                    singleList.push([{
                      No: "10" + address,
                      threeTxt: "单相表A",
                      PhaseType: 1,
                      PointIndex: order[0].Pn.slice(1)
                    },{
                      No: "20" + address,
                      threeTxt: "单相表B",
                      PhaseType: 2,
                      PointIndex: order[0].Pn.slice(1)
                    },{
                      No: "30" + address,
                      threeTxt: "单相表C",
                      PhaseType: 3,
                      PointIndex: order[0].Pn.slice(1)
                    }])
                  }else{
                    threeList.push({
                      No: order[1].Models[0].FiledValue,
                      threeTxt: "三相表" + order[0].Pn.slice(1),
                      PhaseType: 0,
                      PointIndex: order[0].Pn.slice(1)
                    })
                  }
                  var newIndex = order[0].Pn.slice(1) + 1;
                }
                let newThreeList = _that.data.threeList.concat(threeList);
                let newSingleList = _that.data.singleList.concat(singleList);
                _that.setData({
                  singleList: newSingleList,
                  threeList: newThreeList,
                  orderIndex: newIndex
                })
              }
            }
          })  
        }
      }
    })

  },

  onUnload: function(){
    //卸载订阅
    onfire.un("onBLECloseSuccess");
    onfire.un("onBLEValueChangeOnfire");
  },
  readStrength(){
    this.setData({
      isLoad: true
    })
    let obj = {
      "Address":util.getNWAddress(this.data.IAddress),
      "Afn":"12",//读 10 设 04
      "Data": [{
        "Fn": "150080E1",
        "Pn": "P0",
        "Models": []
      }]
    }
    wx.request({
      url: app.globalData.requestUrl + '/api/terminal/Convert',
      data: {
        frameJson: JSON.stringify(obj)
      },
      success: function(res){
        let params =bluetooth.hexToBuffer(res.data.replace(/\s*/g,""));
        bluetooth.sendMy(params);
        
      }
    })
  },
  //点击“读取”按钮，读取该能效交互终端下的所有监测终端
  readMonitor(){
    let _that = this,
      isReadClose = false,
      isReadLock = false,
      i = 1;
    //蓝牙未连接 卸载所有订阅 前往蓝牙登录页面
    // if(!_that.data.isBlueTooth){
    //   onfire.un("onBLECloseSuccess");
    //   onfire.un("onBLEValueChangeOnfire");
    //   wx.navigateTo({
    //     url: '/pages/bluetoothLogin/bluetoothLogin?jumpUrl=terminalDetails'
    //   })
    // }else{
      _that.setData({
        isPopup:true
      })
      setTimeout(function(){
        if(_that.data.isPopup){
          _that.setData({
            isPopup: false,
            isDisable: false,
            isRead: true,
            orderIndex: 1
          })
          wx.showToast({
            image: '/image/warn.png',
            title: '请求超时',
            duration: 2000
          })
        }
      },20000)
      if(_that.data.isPopup){
        var timer = setInterval(function(){
          if(!isReadClose){
            if(!isReadLock){
              isReadLock = true;
              let obj = {
                "Address":util.getNWAddress(_that.data.IAddress),
                "Afn":"10",//读 10 设 04
                "Data": [{
                  "Fn": "000080E0",
                  "Pn": "P" + i,
                  "Models": []
                },{
                  "Fn": "020080E0",
                  "Pn": "P" + i,
                  "Models": []
                },{
                  "Fn": "040080E0",
                  "Pn": "P" + i,
                  "Models": []
                }]
              }
              wx.request({
                url: app.globalData.requestUrl + '/api/terminal/Convert',
                data: {
                  frameJson: JSON.stringify(obj)
                },
                success: function(res){
                  let params =bluetooth.hexToBuffer(res.data.replace(/\s*/g,""));
                  bluetooth.sendMy(params);
                }
              })
              i++;
              isReadLock = false;
              if(i>12){
                isReadClose = true;
                _that.setData({
                  isRead: false,
                  isPopup: false
                })
                clearInterval(timer);
              }
            }
          }
        },250)
      }
    // }
  },
  //点击“添加”按钮
  addMonitor(){
    this.setData({ isEdit: true })
  },
  //点击“删除”按钮
  delMonitor(){
    var _that = this;
    var isDel = _that.data.isDel, radio = _that.data.radio, flag = _that.data.delMonitor.slice(0,2), add = _that.data.delMonitor.slice(2);
    if(!isDel){
      _that.setData({
        isDel: true
      })
    }else{
      if(radio == 0){
        wx.showToast({
          image: '/image/warn.png',
          title: '选择监测终端',
          duration: 1000
        })
        return;
      }else{
        wx.showModal({
          content: "确认删除选中的监测终端？",
          showCancel: true,
          success: function (res) {
            if (res.cancel) {

            } else {
              wx.showModal({
                content: '是否移除档案',
                showCancel: true,//是否显示取消按钮
                cancelText:"否",//默认是“取消”
                confirmText:"是",//默认是“确定”
                success: function (res) {
                  if (res.cancel) {
                    _that.setData({
                      conDel: false,
                      isPopup: true
                    })
                    setTimeout(function(){
                      if(_that.data.isPopup){
                        _that.setData({
                          isPopup: false,
                          isDel: false,
                          radio: 0
                        })
                        wx.showToast({
                          image: '/image/warn.png',
                          title: '请求超时',
                          duration: 2000
                        })
                      }
                    },10000)
                  // 不移除档案
                    let obj = {
                      "Address":util.getNWAddress(_that.data.IAddress),
                      "Afn":"04",//读 10 设 04
                      "Data": [{
                        "Fn": "041100E0",
                        "Pn": "P0",
                        "Models": [{
                          "FiledValue": radio<10 ? ("000"+radio) : ("00"+radio)
                        }, {
                          "FiledValue": "00" + add
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
                  } else {
                    // 移除档案
                    _that.setData({
                      conDel: true,
                      isPopup: true
                    })
                    setTimeout(function(){
                      if(_that.data.isPopup){
                        _that.setData({
                          isPopup: false,
                          isDel: false,
                          radio: 0,
                          conDel: false
                        })
                        wx.showToast({
                          image: '/image/warn.png',
                          title: '请求超时',
                          duration: 2000
                        })
                      }
                    },10000)
                    let obj = {
                      "Address":util.getNWAddress(_that.data.IAddress),
                      "Afn":"04",//读 10 设 04
                      "Data": [{
                        "Fn": "041100E0",
                        "Pn": "P0",
                        "Models": [{
                          "FiledValue": radio<10 ? ("000"+radio) : ("00"+radio)
                        }, {
                          "FiledValue": "00" + add
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
                  }
                },
              })
            }
          },
        })
      }
    }
  },
  //选择待删除的监测终端，修改radio的值
  delChange(e){
    this.setData({
      radio: e.detail
    })
  },
  //记录待删除的监测终端地址
  delChange2(e){
    this.setData({
      delMonitor: e.currentTarget.dataset.address
    })
  },
  //取消删除的状态
  cancel(){
    var _that = this;
    _that.setData({
      isDel: false,
      radio: 0
    })
  },
  //取消添加监测终端
  editCancel(){
    this.setData({ isEdit: false })
  },
  //通过设备蓝牙设置 读设指令，未蓝牙则前往蓝牙登录页面
  updateTerminal(){
    let url, _that = this,
      IAddress = _that.data.IAddress.replace(/\s*/g,""),
      terminalId = _that.data.terminalId;
      if(_that.data.IAddress.length==9) url = '/pages/setParam/setParam?IAddress=' + IAddress + "&terminalId=" + terminalId;
      else url = '/pages/setNWParam/setNWParam?IAddress=' + IAddress + "&terminalId=" + terminalId;
      wx.redirectTo({
        url: url
      })
  },
  //扫码添加监测终端地址
  getScancode(){
    var _that = this;
    wx.scanCode({
      success: (res) => {
        let resAddress, flag;
        if(res.scanType == "CODE_128"){
          resAddress = res.result;
          flag = resAddress.slice(0,2);
        }else{
          resAddress = addressFormatter(res.result).address;
          flag = addressFormatter(res.result).type;
        }
        if(res.errMsg == "scanCode:ok"){
          if(resAddress.length != 12||flag==3){
            _that.showModal("请扫描正确的监测终端地址!")
            return;
          }else{
            wx.request({
              url: app.globalData.requestUrl + "/api/monitoring/GetPointIndexAsync",
              data: {
                interactiveId: _that.data.terminalId,
                address: resAddress
              },
              success: function(res){
                if(res.data > 0){
                  _that.setData({
                    addMonitor: resAddress,
                    addPoint: res.data
                  })
                }else{
                  _that.setData({
                    addMonitor: resAddress,
                    addPoint: _that.data.point,
                  })
                }
              }
            })
          }
        }
      }
    })
  },
  //确认添加 需判断添加的监测点是否被占用
  addConfirm(){
    let _that = this;
    if(_that.data.conAdd){
      _that.setData({
        conAdd: false
      })
      setTimeout(function(){
        _that.setData({
          conAdd: true
        })
      },3000)
      let addPoint = _that.data.addPoint, flag = _that.data.addMonitor.slice(0,2), add = _that.data.addMonitor.slice(2), addMonitor = _that.data.addMonitor, pointList = _that.data.pointList, monitorList = _that.data.monitorList;
      let canAdd = false;
      if(addMonitor == "" || addPoint == ""){
        _that.showModal("信息不能为空");
        return;
      }
      if(pointList.indexOf(addPoint*1) > -1){
        monitorList.forEach(item=>{
          if(item.add==add){
            canAdd = true;
          }
        })
      }else{
        canAdd = true;
      }
      if(canAdd){
        let obj = {
          "Address":util.getNWAddress(_that.data.IAddress),
          "Afn":"04",//读 10 设 04
          "Data": [{
            "Fn": "0F0080E0",
            "Pn": "P" + addPoint,
            "Models": [{
              "FiledValue": 1
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": (flag != "10"&&flag != "20"&&flag != "30") ? addMonitor : "00" + add
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": (flag != "10"&&flag != "20"&&flag != "30") ? 2 : 1
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": "1"
            }, {
              "FiledValue": "000000000000"
            }, {
              "FiledValue": 1
            }, {
              "FiledValue": "2400,1,8,0"
            }, {
              "FiledValue": "0001"
            }, {
              "FiledValue": "0001"
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
      }else{
        _that.showModal("该测量点号已被占用！");
      }
    }
  },
  //监测终端的地址输入
  addressInput(e){
    this.setData({
      addMonitor: e.detail.value
    })
  },
  //监测终端的监测点输入
  pointInput(e){
    this.setData({
      addPoint: e.detail.value
    })
  },

  showModal(error){
    wx.showModal({
      title: '提示',
      content: error,
      showCancel:false
    })
  },
})