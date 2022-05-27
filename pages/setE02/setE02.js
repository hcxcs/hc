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
    isPicker: false,
    isFull: false, //是否全选
    checkLists:[[{
      checkName: "E2000001:计量装置门开闭",
      isCheck: true
    },{
      checkName: "E2000003:电压逆相序",
      isCheck: true
    },{
      checkName: "E2000004:电流不平衡",
      isCheck: true
    },{
      checkName: "E2000005:电压不平衡",
      isCheck: true
    },{
      checkName: "E2000006:零序电流偏大",
      isCheck: true
    },{
      checkName: "E2000007:A相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E2000008:B相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E2000009:C相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E200000A:A相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000B:B相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000C:C相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000D:A相潮流反向",
      isCheck: true
    },{
      checkName: "E200000E:B相潮流反向",
      isCheck: true
    },{
      checkName: "E200000F:C相潮流反向",
      isCheck: true
    },{
      checkName: "E2000010:A相电流过流",
      isCheck: true
    },{
      checkName: "E2000011:B相电流过流",
      isCheck: true
    },{
      checkName: "E2000012:C相电流过流",
      isCheck: true
    },{
      checkName: "E2000013:A相电流失流",
      isCheck: true
    },{
      checkName: "E2000014:B相电流失流",
      isCheck: true
    },{
      checkName: "E2000015:C相电流失流",
      isCheck: true
    },{
      checkName: "E2000016:A相电压失压",
      isCheck: true
    },{
      checkName: "E2000017:B相电压失压",
      isCheck: true
    },{
      checkName: "E2000018:C相电压失压",
      isCheck: true
    },{
      checkName: "E2000019:全失压",
      isCheck: true
    },{
      checkName: "E200001A:A相电压过压",
      isCheck: true
    },{
      checkName: "E200001B:B相电压过压",
      isCheck: true
    },{
      checkName: "E200001C:C相电压过压",
      isCheck: true
    },{
      checkName: "E200001D:A相电压断相",
      isCheck: true
    },{
      checkName: "E200001E:B相电压断相",
      isCheck: true
    },{
      checkName: "E200001F:C相电压断相",
      isCheck: true
    },{
      checkName: "E2000020:A相电压畸变",
      isCheck: true
    },{
      checkName: "E2000021:B相电压畸变",
      isCheck: true
    },{
      checkName: "E2000022:C相电压畸变",
      isCheck: true
    },{
      checkName: "E2000023:A相电流畸变",
      isCheck: true
    },{
      checkName: "E2000024:B相电流畸变",
      isCheck: true
    },{
      checkName: "E2000025:C相电流畸变",
      isCheck: true
    },{
      checkName: "E2000026:无功过补偿",
      isCheck: true
    },{
      checkName: "E2000027:无功欠补偿",
      isCheck: true
    },{
      checkName: "E2000028:功率超定值",
      isCheck: true
    },{
      checkName: "E2000029:负荷过载",
      isCheck: true
    },{
      checkName: "E200002A:超合同容量用电",
      isCheck: true
    },{
      checkName: "E200002B:剩余电费不足",
      isCheck: true
    },{
      checkName: "E200002C:示度下降",
      isCheck: true
    },{
      checkName: "E200002D:电能表飞走",
      isCheck: true
    },{
      checkName: "E200002E:电能表停走",
      isCheck: true
    },{
      checkName: "E200002F:电能表通讯失败",
      isCheck: true
    },{
      checkName: "E2000030:差动告警",
      isCheck: true
    },{
      checkName: "E2000031:最大需量手动复零",
      isCheck: true
    },{
      checkName: "E2000032:时钟电池电压过低",
      isCheck: true
    },{
      checkName: "E2000033:终端掉电",
      isCheck: true
    },{
      checkName: "E2000034:终端上电",
      isCheck: true
    },{
      checkName: "E2000035:电能表编程时间更改",
      isCheck: true
    },{
      checkName: "E2000036:电能表时段或费率更改",
      isCheck: true
    },{
      checkName: "E2000037:电能表脉冲常数更改",
      isCheck: true
    },{
      checkName: "E2000038:计量互感器倍率更改",
      isCheck: true
    },{
      checkName: "E2000039:遥信变位",
      isCheck: true
    },{
      checkName: "E200003A:月通信流量越限",
      isCheck: true
    },{
      checkName: "E200003B:继电器变位",
      isCheck: true
    },{
      checkName: "E200003C:电能表拉合闸失败",
      isCheck: true
    },{
      checkName: "E200003D:抄表失败",
      isCheck: true
    },{
      checkName: "E200003E:电能表时钟异常",
      isCheck: true
    },{
      checkName: "E200003F:电能表校时失败",
      isCheck: true
    },{
      checkName: "E2000040:电能表A、B、C相失压总次数",
      isCheck: true
    },{
      checkName: "E2000041:电能表A、B、C相失流总次数",
      isCheck: true
    },{
      checkName: "E2000042:电能表A、B、C相潮流反向总次数",
      isCheck: true
    },{
      checkName: "E2000043:电能表编程总次数",
      isCheck: true
    },{
      checkName: "E2000044:A相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000045:B相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000046:C相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000047:频率偏差越限",
      isCheck: true
    },{
      checkName: "E2000048:A相闪变越限",
      isCheck: true
    },{
      checkName: "E2000049:B相闪变越限",
      isCheck: true
    },{
      checkName: "E200004A:C相闪变越限",
      isCheck: true
    },{
      checkName: "E200004C:发现未知电表",
      isCheck: true
    },{
      checkName: "E200004D:表端钮盒开启告警",
      isCheck: true
    },{
      checkName: "E200004E:表盖开启告警",
      isCheck: true
    },{
      checkName: "E20010FF:读所有主动上送未成功的告警数据",
      isCheck: true
    }],[{
      checkName: "E2000001:计量装置门开闭",
      isCheck: false
    },{
      checkName: "E2000003:电压逆相序",
      isCheck: false
    },{
      checkName: "E2000004:电流不平衡",
      isCheck: false
    },{
      checkName: "E2000005:电压不平衡",
      isCheck: false
    },{
      checkName: "E2000006:零序电流偏大",
      isCheck: false
    },{
      checkName: "E2000007:A相CT二次侧短路",
      isCheck: false
    },{
      checkName: "E2000008:B相CT二次侧短路",
      isCheck: false
    },{
      checkName: "E2000009:C相CT二次侧短路",
      isCheck: false
    },{
      checkName: "E200000A:A相CT二次侧开路",
      isCheck: false
    },{
      checkName: "E200000B:B相CT二次侧开路",
      isCheck: false
    },{
      checkName: "E200000C:C相CT二次侧开路",
      isCheck: false
    },{
      checkName: "E200000D:A相潮流反向",
      isCheck: false
    },{
      checkName: "E200000E:B相潮流反向",
      isCheck: false
    },{
      checkName: "E200000F:C相潮流反向",
      isCheck: false
    },{
      checkName: "E2000010:A相电流过流",
      isCheck: false
    },{
      checkName: "E2000011:B相电流过流",
      isCheck: false
    },{
      checkName: "E2000012:C相电流过流",
      isCheck: false
    },{
      checkName: "E2000013:A相电流失流",
      isCheck: false
    },{
      checkName: "E2000014:B相电流失流",
      isCheck: true
    },{
      checkName: "E2000015:C相电流失流",
      isCheck: true
    },{
      checkName: "E2000016:A相电压失压",
      isCheck: false
    },{
      checkName: "E2000017:B相电压失压",
      isCheck: false
    },{
      checkName: "E2000018:C相电压失压",
      isCheck: false
    },{
      checkName: "E2000019:全失压",
      isCheck: false
    },{
      checkName: "E200001A:A相电压过压",
      isCheck: false
    },{
      checkName: "E200001B:B相电压过压",
      isCheck: false
    },{
      checkName: "E200001C:C相电压过压",
      isCheck: true
    },{
      checkName: "E200001D:A相电压断相",
      isCheck: false
    },{
      checkName: "E200001E:B相电压断相",
      isCheck: false
    },{
      checkName: "E200001F:C相电压断相",
      isCheck: false
    },{
      checkName: "E2000020:A相电压畸变",
      isCheck: false
    },{
      checkName: "E2000021:B相电压畸变",
      isCheck: false
    },{
      checkName: "E2000022:C相电压畸变",
      isCheck: false
    },{
      checkName: "E2000023:A相电流畸变",
      isCheck: false
    },{
      checkName: "E2000024:B相电流畸变",
      isCheck: false
    },{
      checkName: "E2000025:C相电流畸变",
      isCheck: false
    },{
      checkName: "E2000026:无功过补偿",
      isCheck: false
    },{
      checkName: "E2000027:无功欠补偿",
      isCheck: false
    },{
      checkName: "E2000028:功率超定值",
      isCheck: false
    },{
      checkName: "E2000029:负荷过载",
      isCheck: false
    },{
      checkName: "E200002A:超合同容量用电",
      isCheck: false
    },{
      checkName: "E200002B:剩余电费不足",
      isCheck: true
    },{
      checkName: "E200002C:示度下降",
      isCheck: false
    },{
      checkName: "E200002D:电能表飞走",
      isCheck: false
    },{
      checkName: "E200002E:电能表停走",
      isCheck: false
    },{
      checkName: "E200002F:电能表通讯失败",
      isCheck: false
    },{
      checkName: "E2000030:差动告警",
      isCheck: false
    },{
      checkName: "E2000031:最大需量手动复零",
      isCheck: false
    },{
      checkName: "E2000032:时钟电池电压过低",
      isCheck: false
    },{
      checkName: "E2000033:终端掉电",
      isCheck: true
    },{
      checkName: "E2000034:终端上电",
      isCheck: false
    },{
      checkName: "E2000035:电能表编程时间更改",
      isCheck: false
    },{
      checkName: "E2000036:电能表时段或费率更改",
      isCheck: false
    },{
      checkName: "E2000037:电能表脉冲常数更改",
      isCheck: false
    },{
      checkName: "E2000038:计量互感器倍率更改",
      isCheck: false
    },{
      checkName: "E2000039:遥信变位",
      isCheck: false
    },{
      checkName: "E200003A:月通信流量越限",
      isCheck: false
    },{
      checkName: "E200003B:继电器变位",
      isCheck: true
    },{
      checkName: "E200003C:电能表拉合闸失败",
      isCheck: false
    },{
      checkName: "E200003D:抄表失败",
      isCheck: false
    },{
      checkName: "E200003E:电能表时钟异常",
      isCheck: false
    },{
      checkName: "E200003F:电能表校时失败",
      isCheck: false
    },{
      checkName: "E2000040:电能表A、B、C相失压总次数",
      isCheck: false
    },{
      checkName: "E2000041:电能表A、B、C相失流总次数",
      isCheck: true
    },{
      checkName: "E2000042:电能表A、B、C相潮流反向总次数",
      isCheck: false
    },{
      checkName: "E2000043:电能表编程总次数",
      isCheck: false
    },{
      checkName: "E2000044:A相电压偏差越限",
      isCheck: false
    },{
      checkName: "E2000045:B相电压偏差越限",
      isCheck: false
    },{
      checkName: "E2000046:C相电压偏差越限",
      isCheck: false
    },{
      checkName: "E2000047:频率偏差越限",
      isCheck: false
    },{
      checkName: "E2000048:A相闪变越限",
      isCheck: false
    },{
      checkName: "E2000049:B相闪变越限",
      isCheck: true
    },{
      checkName: "E200004A:C相闪变越限",
      isCheck: true
    },{
      checkName: "E200004C:发现未知电表",
      isCheck: true
    },{
      checkName: "E200004D:表端钮盒开启告警",
      isCheck: false
    },{
      checkName: "E200004E:表盖开启告警",
      isCheck: true
    },{
      checkName: "E20010FF:读所有主动上送未成功的告警数据",
      isCheck: true
    }],[
      {
        checkName: "E2010001:编程记录",
        isCheck: true
      },{
        checkName: "E2010002:最大需量结算日自动复零",
        isCheck: true
      },
      {
        checkName: "E2010003:最大需量手动复零",
        isCheck: true
      },{
        checkName: "E2010004:A相失压记录",
        isCheck: true
      },
      {
        checkName: "E2010005:B相失压记录",
        isCheck: true
      },{
        checkName: "E2010006:C相失压记录",
        isCheck: true
      },
      {
        checkName: "E2010007:A相失流记录",
        isCheck: true
      },{
        checkName: "E2010008:B相失流记录",
        isCheck: true
      },
      {
        checkName: "E2010009:C相流压记录",
        isCheck: true
      },{
        checkName: "E201000A:终端掉电上电记录",
        isCheck: true
      },
      {
        checkName: "E201000B:A相断相记录",
        isCheck: true
      },{
        checkName: "E201000C:B相断相记录",
        isCheck: true
      },
      {
        checkName: "E201000D:C相断相记录",
        isCheck: true
      },{
        checkName: "E201000E:控制事件记录",
        isCheck: true
      },
      {
        checkName: "E201000F:电量清零记录",
        isCheck: true
      },{
        checkName: "E2010010:校时记录",
        isCheck: true
      },
      {
        checkName: "E2010011:表端钮盒开启记录",
        isCheck: true
      },{
        checkName: "E2010012:表盖开启记录",
        isCheck: true
      },
      {
        checkName: "E2010013:消息认证错误记录",
        isCheck: true
      },{
        checkName: "E2010014:参数变更记录",
        isCheck: true
      },
      {
        checkName: "E2010015:计量门箱开闭记录",
        isCheck: true
      },{
        checkName: "E20100FF:所有类型事件记录",
        isCheck: true
      }
    ]],
    checkList:[{
      checkName: "E2000001:计量装置门开闭",
      isCheck: true
    },{
      checkName: "E2000003:电压逆相序",
      isCheck: true
    },{
      checkName: "E2000004:电流不平衡",
      isCheck: true
    },{
      checkName: "E2000005:电压不平衡",
      isCheck: true
    },{
      checkName: "E2000006:零序电流偏大",
      isCheck: true
    },{
      checkName: "E2000007:A相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E2000008:B相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E2000009:C相CT二次侧短路",
      isCheck: true
    },{
      checkName: "E200000A:A相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000B:B相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000C:C相CT二次侧开路",
      isCheck: true
    },{
      checkName: "E200000D:A相潮流反向",
      isCheck: true
    },{
      checkName: "E200000E:B相潮流反向",
      isCheck: true
    },{
      checkName: "E200000F:C相潮流反向",
      isCheck: true
    },{
      checkName: "E2000010:A相电流过流",
      isCheck: true
    },{
      checkName: "E2000011:B相电流过流",
      isCheck: true
    },{
      checkName: "E2000012:C相电流过流",
      isCheck: true
    },{
      checkName: "E2000013:A相电流失流",
      isCheck: true
    },{
      checkName: "E2000014:B相电流失流",
      isCheck: true
    },{
      checkName: "E2000015:C相电流失流",
      isCheck: true
    },{
      checkName: "E2000016:A相电压失压",
      isCheck: true
    },{
      checkName: "E2000017:B相电压失压",
      isCheck: true
    },{
      checkName: "E2000018:C相电压失压",
      isCheck: true
    },{
      checkName: "E2000019:全失压",
      isCheck: true
    },{
      checkName: "E200001A:A相电压过压",
      isCheck: true
    },{
      checkName: "E200001B:B相电压过压",
      isCheck: true
    },{
      checkName: "E200001C:C相电压过压",
      isCheck: true
    },{
      checkName: "E200001D:A相电压断相",
      isCheck: true
    },{
      checkName: "E200001E:B相电压断相",
      isCheck: true
    },{
      checkName: "E200001F:C相电压断相",
      isCheck: true
    },{
      checkName: "E2000020:A相电压畸变",
      isCheck: true
    },{
      checkName: "E2000021:B相电压畸变",
      isCheck: true
    },{
      checkName: "E2000022:C相电压畸变",
      isCheck: true
    },{
      checkName: "E2000023:A相电流畸变",
      isCheck: true
    },{
      checkName: "E2000024:B相电流畸变",
      isCheck: true
    },{
      checkName: "E2000025:C相电流畸变",
      isCheck: true
    },{
      checkName: "E2000026:无功过补偿",
      isCheck: true
    },{
      checkName: "E2000027:无功欠补偿",
      isCheck: true
    },{
      checkName: "E2000028:功率超定值",
      isCheck: true
    },{
      checkName: "E2000029:负荷过载",
      isCheck: true
    },{
      checkName: "E200002A:超合同容量用电",
      isCheck: true
    },{
      checkName: "E200002B:剩余电费不足",
      isCheck: true
    },{
      checkName: "E200002C:示度下降",
      isCheck: true
    },{
      checkName: "E200002D:电能表飞走",
      isCheck: true
    },{
      checkName: "E200002E:电能表停走",
      isCheck: true
    },{
      checkName: "E200002F:电能表通讯失败",
      isCheck: true
    },{
      checkName: "E2000030:差动告警",
      isCheck: true
    },{
      checkName: "E2000031:最大需量手动复零",
      isCheck: true
    },{
      checkName: "E2000032:时钟电池电压过低",
      isCheck: true
    },{
      checkName: "E2000033:终端掉电",
      isCheck: true
    },{
      checkName: "E2000034:终端上电",
      isCheck: true
    },{
      checkName: "E2000035:电能表编程时间更改",
      isCheck: true
    },{
      checkName: "E2000036:电能表时段或费率更改",
      isCheck: true
    },{
      checkName: "E2000037:电能表脉冲常数更改",
      isCheck: true
    },{
      checkName: "E2000038:计量互感器倍率更改",
      isCheck: true
    },{
      checkName: "E2000039:遥信变位",
      isCheck: true
    },{
      checkName: "E200003A:月通信流量越限",
      isCheck: true
    },{
      checkName: "E200003B:继电器变位",
      isCheck: true
    },{
      checkName: "E200003C:电能表拉合闸失败",
      isCheck: true
    },{
      checkName: "E200003D:抄表失败",
      isCheck: true
    },{
      checkName: "E200003E:电能表时钟异常",
      isCheck: true
    },{
      checkName: "E200003F:电能表校时失败",
      isCheck: true
    },{
      checkName: "E2000040:电能表A、B、C相失压总次数",
      isCheck: true
    },{
      checkName: "E2000041:电能表A、B、C相失流总次数",
      isCheck: true
    },{
      checkName: "E2000042:电能表A、B、C相潮流反向总次数",
      isCheck: true
    },{
      checkName: "E2000043:电能表编程总次数",
      isCheck: true
    },{
      checkName: "E2000044:A相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000045:B相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000046:C相电压偏差越限",
      isCheck: true
    },{
      checkName: "E2000047:频率偏差越限",
      isCheck: true
    },{
      checkName: "E2000048:A相闪变越限",
      isCheck: true
    },{
      checkName: "E2000049:B相闪变越限",
      isCheck: true
    },{
      checkName: "E200004A:C相闪变越限",
      isCheck: true
    },{
      checkName: "E200004C:发现未知电表",
      isCheck: true
    },{
      checkName: "E200004D:表端钮盒开启告警",
      isCheck: true
    },{
      checkName: "E200004E:表盖开启告警",
      isCheck: true
    },{
      checkName: "E20010FF:读所有主动上送未成功的告警数据",
      isCheck: true
    }],
    columns:[{
      FiledValue:"告警主动上报屏蔽字",
      KeyValue: "500100E0"
    },{
      FiledValue:"告警判断屏蔽字",
      KeyValue: "510100E0"
    },{
      FiledValue:"事件记录屏蔽字",
      KeyValue: "520100E0"
    }],
    index: 0,
    FiledValue:"告警主动上报屏蔽字",
    KeyValue: "500100E0"
  },

  onLoad: function (options) {
    let IAddress = options.IAddress;
    if(IAddress){
      this.setData({ IAddress })
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
      console.log("蓝牙回复" + data)
      //读取指令 蓝牙回复
      if(_that.data.isRead){
        wx.request({
          url: app.globalData.requestUrl + '/api/terminal/Parse',
          data: {
            hexString: data
          },
          success: function(res){
            if(res.statusCode == "200"){
              _that.showModal({
                msg: "读取成功"
              })
            let checkList = _that.data.checkList
            let str = res.data.Data[0].Models[0].FiledValue
            let strAry = str.split('')
            for(let i in checkList){
              let hex16 = checkList[i].checkName.split(':')[0].substring(6)
              let int10 = _that.hex2int(hex16)
              if(strAry[int10 - 1] == 1){
                checkList[i].isCheck = true;
              }else{
                checkList[i].isCheck = false;
              }
            }
            _that.setData({checkList, isPopup:false})
          }
          }
        })
      }else{
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
    let obj = {
      "Address": util.getNWAddress(_that.data.IAddress),
      "Afn":"10",//读 10 设 04
      "Data": [{
        "Fn": _that.data.KeyValue,
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
        var params =bluetooth.hexToBuffer(res.data.replace(/\s*/g,""));
        bluetooth.sendMy(params);
      }
    })
  },

  orderSet: function(){
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
    let str = ""
    str = str.padEnd(256,0)
    let checkList = _that.data.checkList
    for(let i in checkList){
      if(checkList[i].isCheck){
        let hex16 = checkList[i].checkName.split(':')[0].substring(6)
        let int10 = _that.hex2int(hex16)
        let strAry = str.split('')
        strAry[int10 - 1] = 1
        str = strAry.join('')
      }
    }
    let obj = {
      "Address": util.getNWAddress(_that.data.IAddress),
      "Afn":"04",//读 10 设 04
      "Data": [{
        "Fn": _that.data.KeyValue,
        "Pn": "P0",
        "Models": [{
          "FiledValue": str
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

  showPicker(){
    this.setData({
      isPicker: true
    })
  },
  pickerCancel(){
    this.setData({
      isPicker: false
    })
  },
  pickerConfirm(e){
    console.log(e)
    let index = e.detail.index
    let FiledValue = e.detail.value.FiledValue
    let KeyValue = e.detail.value.KeyValue
    let checkList = this.data.checkLists[index]
    this.setData({
      index, FiledValue, KeyValue, checkList,
      isPicker: false,
      isFull: false
    })
  },
  showModal(error){
    wx.showModal({
      title: '提示',
      content: error.msg,
      showCancel:false
    })
  },
  hex2int(hex) {
    var len = hex.length, a = new Array(len), code;
    for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48<=code && code < 58) {
            code -= 48;
        } else {
            code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
    }
     
    return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
    }, 0);
  }
})