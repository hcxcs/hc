// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
    properties: {
      model: Object
    },
  /**
   * 组件的初始数据
   */
    data: {
        selectShow:false,//初始option不显示
        nowText : wx.getStorageSync("areaName") ? wx.getStorageSync('areaName') : "请选择",//初始内容
        open: true,
        isBranch: false,
    },
  /**
   * 组件的方法列表
   */
    methods: {
　　　//option的显示与否
        selectToggle:function(){
            var nowShow=this.data.selectShow;//获取当前option显示的状态
            this.setData({
                selectShow: !nowShow
            })
        },

        toggle: function(e) {
          if (this.data.isBranch) {
            this.setData({
              open: !this.data.open,
            })
          }
        },
        
        tapItem: function(e) {
          var itemid = "";
          var value = "";
          if(e.detail.itemid == undefined){
            itemid = e.currentTarget.dataset.itemid;
            value = e.currentTarget.dataset.value;
          }else{
            itemid = e.detail.itemid;
            value = e.detail.value;
          }
          this.triggerEvent('tapitem', { value: value,itemid: itemid }, { bubbles: true, composed: true });
          wx.setStorageSync("areaId",itemid);
          wx.setStorageSync("areaName",value);
          this.setData({
            selectShow: false,
            nowText:value
          })
        }
    },
    ready: function(e) {
      this.setData({
        isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
        nowText:wx.getStorageSync('areaName')
      });
    }
})