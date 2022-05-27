const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getAddress = data => {
  var add = data.slice(4);
  var newAdd = Number(add).toString(16);
  var newAdd2 = "";
  if(newAdd.length<4){
    for(var i = 0; i < (4-(newAdd.length))*1; i++){
      newAdd2 += "0";
      if(i==4-(newAdd.length)*1-1){
        newAdd2 += newAdd;
        newAdd = newAdd2;
      }
    }
  }
  return data.slice(0,4) + newAdd;
}

const getNWAddress = data => {
  var add = data.slice(6);
  var newAdd = Number(add).toString(16);
  var newAdd2 = "";
  if(newAdd.length<6){
    for(var i = 0; i < (6-(newAdd.length))*1; i++){
      newAdd2 += "0";
      if(i==6-(newAdd.length)*1-1){
        newAdd2 += newAdd;
        newAdd = newAdd2;
      }
    }
  }
  return data.slice(0,6) + newAdd;
}

const addressFormatter = data => {
  //0597 P D APC EC00 EC02 1000001 F
  let arr = data.split(' ');
  let address = arr[arr.length-2];
  let addressArr = address.split('');
  let newAdd = addressArr;
  for(let i = 0; i < 5; i++){
    newAdd.splice(1, 0, "0");
  }
  let obj = {
    //type 1单相表 2多相表
    type: newAdd[0]==0||newAdd[0]==4?2:(newAdd[0]==1||newAdd[0]==2||newAdd[0]==3?'1':'3'),
    address: newAdd.join('')
  }
  return obj;
}

module.exports = {
  formatTime: formatTime,
  getAddress: getAddress,
  getNWAddress: getNWAddress,
  addressFormatter: addressFormatter
}
