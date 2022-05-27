const onfire = require("./onfire1.0.6.js");
var isShowLoading = false;
const BluetoothDetail = {
  inputValue: '',//想要链接的蓝牙设备id
  deviceId: '',//设备ID
  services: '',//蓝牙设备的uuid
  notify: '',//支持notify的特征值
  write: '',//支持write的特征值
  deviceInfo:{},//蓝牙设备基本信息
  devices:[],//搜索到符合条件的蓝牙设备
}
// 1.判断用户手机蓝牙是否打开
const bluetoothLoad = inputValue => {
  if(inputValue)
    BluetoothDetail.inputValue = inputValue;
  wx.openBluetoothAdapter({//调用微信小程序api 打开蓝牙适配器接口
    success: (res) => {
      findBlue();
    },
    fail: (res) => {//如果手机上的蓝牙没有打开，可以提醒用户
      wx.showToast({
        title: '请开启蓝牙',
        image: '/image/warn.png',
        duration: 1000
      })
    }
  })
}
//2.搜索附近蓝牙设备
const findBlue = () => {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: function (res) {
      if(!isShowLoading){
        isShowLoading = true;
        getBlue();
      }
    }
  })
}

//3.获取蓝牙设备信息
const getBlue = () => {
  wx.onBluetoothDeviceFound({
    success: function (res) {
      if(isShowLoading){
        isShowLoading =false;
      }
      res.devices.forEach(device => {
        if (!device.name&&!device.localName&&device.name=="未知设备") return;
        const foundDevices = BluetoothDetail.devices;
        const idx = inArray(foundDevices, 'deviceId', device.deviceId);
        if (idx === -1) {
          BluetoothDetail.devices.push(device);
        } else {
          BluetoothDetail.devices[idx] = device;
        }
      })
      onfire.fire("onBLEDeviceUpdateOnfire",BluetoothDetail.devices);
    },
    fail: function () {
      console.log("搜索蓝牙设备失败")
    }
  })
}
//4.通过蓝牙设备的id进行蓝牙连接
const connetBlue = deviceId => {
  wx.createBLEConnection({
    deviceId: deviceId,//设备id
    success: function (res) {
      BluetoothDetail.deviceId=deviceId;
      wx.stopBluetoothDevicesDiscovery({//关闭蓝牙搜索
        success: function (res) {
        }
      })
      getServiceId();
    }
  })
}
//5.获取服务的uuid
const getServiceId = () => {
  wx.getBLEDeviceServices({
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId: BluetoothDetail.deviceId,
    success: function (res) {
      var model = res.services[0]
      BluetoothDetail.services=model.uuid;
      getCharacteId();
    }
  })
}
//6.判断蓝牙设备的特性值
const getCharacteId = () => {
  wx.getBLEDeviceCharacteristics({
    deviceId: BluetoothDetail.deviceId,
    serviceId: BluetoothDetail.services,
    success: function (res) {
      for (var i = 0; i < res.characteristics.length; i++) {//2个值
        var model = res.characteristics[i]
        if (model.properties.notify == true) {
          BluetoothDetail.notifyId= model.uuid//监听的值
          startNotice(BluetoothDetail.notifyId);
        }
        if (model.properties.write == true) {
            BluetoothDetail.writeId=model.uuid//用来写入的值
        }
      }
    }
  })
}
//7.notify
const startNotice = uuid => {
  wx.notifyBLECharacteristicValueChange({
    state: true, // 启用 notify 功能
    deviceId: BluetoothDetail.deviceId,
    serviceId: BluetoothDetail.services,
    characteristicId: uuid,
    success: function (res) {
      onfire.fire("onBLEConnSuccess",res.errMsg);
      setTimeout(()=>{
        wx.onBLECharacteristicValueChange(function (characteristic) {//监听蓝牙回复
          let hex = bufferToHex(characteristic.value)//用来写入的值
          //逻辑
          getHex(hex);
        });
      },1000);
    },
    fail:function(res){
      console.log('启用notify 功能失败');
    }
  })
}
// 8.写入蓝牙设备 
const send = buffer => {
  wx.writeBLECharacteristicValue({
    deviceId: BluetoothDetail.deviceId,
    serviceId: BluetoothDetail.services,
    characteristicId: BluetoothDetail.writeId,//第二步写入的特征值
    value: buffer,
    success: function (res) {
      
    },
    fail: function () {
      console.log('写入失败')
    },
  })
}
//9.关闭蓝牙
const closeBleConnettion=()=>{
  wx.closeBLEConnection({
      deviceId: BluetoothDetail.deviceId,
      success: function (res) {
        emptyInfo();
        console.log('断开蓝牙设备成功：' + res.errMsg)
      },
      fail:function(res){
        console.log('断开蓝牙设备失败：' + res.errMsg)
      }
  });
}
//清空蓝牙信息
const emptyInfo=()=>{
  BluetoothDetail.devicesId="";
  BluetoothDetail.services="";
  BluetoothDetail.notify="";
  BluetoothDetail.write="";
  BluetoothDetail.deviceInfo="";
}
// 将16进制字符串转换成ArrayBufer
const hexToBuffer = str => {
  let buffer='';
  if (str != "") {
    buffer=new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer;
  }
  return buffer;
}
// 将ArrayBufer转换成16进制字符串
const bufferToHex = buffer => {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('').toUpperCase();
}
var arrayHex=[];
var lenHex=0;
const getHex=hexStr=>{
    var arr=Str2Bytes(hexStr);
     if(arrayHex.length==0&&arr!=null){
       var satrtIndex= arr.indexOf(parseInt('68',16));
       if(satrtIndex>=0){
           arr.splice(0,satrtIndex);//移除垃圾数据
           if(arr.length>5&&arr[5]==parseInt('68',16)){
             var countBytes=[arr[1],arr[2]].reverse();
             var str=(parseInt(countBytes[0],10).toString(2).padStart(8,'0')+parseInt(countBytes[1],10).toString(2).padStart(8,'0')).substring(0,14);
             lenHex = parseInt(str,2)+8;
             arrayHex = arr;
           }
       }else{
           return;
       }
     }
     else{
        arrayHex = arrayHex.concat(arr);
     }
     if(lenHex>0&&arrayHex.length>=lenHex){
        var hex=Bytes2Str(arrayHex);
        onfire.fire("onBLEValueChangeOnfire",hex);
        arrayHex=[];
        lenHex=0;
     }
}
const Str2Bytes=str=>{
    var pos = 0;
    var len = str.length;
    if(len %2 != 0) {
       return null; 
    }
    len /= 2;
    var hexA = new Array();
    for(var i=0; i<len; i++){
       var s = str.substr(pos, 2);
       var v = parseInt(s, 16);
       hexA.push(v);
       pos += 2;
    }
    return hexA;
}
const Bytes2Str=arr=>{
  var str = "";
  for(var i=0; i<arr.length; i++){
     var tmp = arr[i].toString(16);
     if(tmp.length == 1){
         tmp = "0" + tmp;
     }
     str += tmp;
  }
  return str.toUpperCase();
}
const sendMy=msg=>{
  let buffer = msg;
  let bytes = buffer.byteLength;
  while (bytes > 0) {
    var buf=buffer;
      buf=buf.slice(0,20);
      send(buf);
      var start=buf.byteLength;
      buffer=buffer.slice(start,bytes);
      bytes=buffer.byteLength;
  }
}
const inArray = (arr, key, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}
module.exports = {
  hexToBuffer:hexToBuffer,
  bufferToHex:bufferToHex,
  closeBleConnettion:closeBleConnettion,
  sendMy:sendMy,
  bluetoothLoad:bluetoothLoad,
  connetBlue:connetBlue
}