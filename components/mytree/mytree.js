Component({
  properties: {
    model: Array,
  },

  data: {
    open: true,
    courtsId: "",
    courtsName: ""
  },

  methods: {
    toggle: function(e) {
      const children = e.currentTarget.dataset.children;
      const court = e.currentTarget.dataset.id;
      if (children.length > 0) {
        this.setData({
          open: !this.data.open,
          checkCourt: court
        })
      }
    },
    
    tapItem: function(e) {
      const children = e.currentTarget.dataset.children;
      const itemid = e.currentTarget.dataset.itemid;
      const value = e.currentTarget.dataset.value;

      
      this.setData({
        courtsId: itemid,
        courtsName: value
      })
      this.triggerEvent('tapitem', { value: value,itemid: itemid, children: children }, { bubbles: true, composed: true });
    }
  },

})